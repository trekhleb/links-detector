import { GraphModel } from '@tensorflow/tfjs';
import {
  ConfigResult,
  DetectResult,
  Line,
  RecognizeOptions,
  RecognizeResult,
  Rectangle,
  Scheduler,
} from 'tesseract.js';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import useGraphModel from './useGraphModel';
import useLogger from './useLogger';
import useTesseract from './useTesseract';
import { ZeroOneRange } from '../utils/types';
import { newProfiler, Profiler } from '../utils/profiler';
import { DetectionBox, graphModelExecute } from '../utils/graphModel';
import {
  brightnessFilter,
  contrastFilter,
  FilterFunc,
  greyscaleFilter,
  Pixels,
  preprocessPixels,
  relativeToAbsolute,
} from '../utils/image';
import { JobTypes } from '../utils/tesseract';
import { toFloatFixed } from '../utils/numbers';
import { Loggers } from '../utils/logger';

export type DetectionPerformance = {
  processing: number,
  avgProcessing: number,
  inference: number,
  avgInference: number,
  ocr: number,
  avgOcr: number,
  total: number,
  avgFps: number,
  fps: number,
};

export type DetectedLink = {
  url: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
};

export type UseLinkDetectorProps = {
  modelURL: string,
  maxBoxesNum: number,
  scoreThreshold: number,
  iouThreshold: number,
  workersNum: number,
  language: string,
};

export type DetectProps = {
  video: HTMLVideoElement,
  videoBrightness: number,
  videoContrast: number,
  resizeToSize: number,
  applyFilters: boolean,
  regionProposalsPadding: ZeroOneRange,
  useRegionProposals: boolean,
};

export type UseLinkDetectorOutput = {
  detectLinks: (props: DetectProps) => Promise<DetectionPerformance | null>,
  detectedLinks: DetectedLink[],
  error: string | null,
  loadingProgress: ZeroOneRange | null,
  loadingStage: string | null,
  httpsBoxes: DetectionBox[] | null,
  regionProposals: Rectangle[],
  pixels: Pixels | null,
};

export type TesseractDetection = ConfigResult | RecognizeResult | DetectResult;

// @see: https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
const URL_REG_EXP = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi;

const extractLinkFromText = (text: string): string | null => {
  const urls: string[] | null = text.match(URL_REG_EXP);
  if (!urls || !urls.length) {
    return null;
  }
  return urls[0];
};

const extractLinkFromDetection = (
  detection: TesseractDetection | null,
  logger: Loggers,
): DetectedLink | null => {
  if (!detection || !detection.data || !detection.data.lines || !detection.data.lines.length) {
    logger.logDebug('extractLinkFromDetection: empty');
    return null;
  }
  for (let lineIndex = 0; lineIndex < detection.data.lines.length; lineIndex += 1) {
    const line: Line = detection.data.lines[lineIndex];
    const url: string | null = extractLinkFromText(line.text);
    logger.logDebug('extractLinkFromDetection: line link', { url, text: line.text });
    if (url) {
      const detectedLink: DetectedLink = {
        url,
        x1: line.bbox.x0,
        y1: line.bbox.y0,
        x2: line.bbox.x1,
        y2: line.bbox.y1,
      };
      logger.logDebug('extractLinkFromDetection: detected', { detectedLink });
      return detectedLink;
    }
  }
  return null;
};

const useLinksDetector = (props: UseLinkDetectorProps): UseLinkDetectorOutput => {
  const {
    modelURL,
    iouThreshold,
    maxBoxesNum,
    scoreThreshold,
    workersNum,
    language,
  } = props;

  const preprocessingProfiler = useRef<Profiler>(newProfiler());
  const inferenceProfiler = useRef<Profiler>(newProfiler());
  const ocrProfiler = useRef<Profiler>(newProfiler());
  const onFrameProfiler = useRef<Profiler>(newProfiler());

  const modelRef = useRef<GraphModel | null>(null);
  const tesseractSchedulerRef = useRef<Scheduler | null>(null);

  const logger: Loggers = useLogger({ context: 'useLinksDetector' });

  const [detectedLinks, setDetectedLinks] = useState<DetectedLink[]>([]);
  const [pixels, setPixels] = useState<Pixels | null>(null);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const [httpsBoxes, setHttpsBoxes] = useState<DetectionBox[] | null>(null);
  const [regionProposals, setRegionProposals] = useState<Rectangle[]>([]);
  const [loadingProgress, setLoadingProgress] = useState<ZeroOneRange | null>(null);
  const [loadingStage, setLoadingStage] = useState<string | null>(null);

  const {
    model,
    error: modelError,
    loadingProgress: modelLoadingProgress,
  } = useGraphModel({
    modelURL,
    warmup: true,
  });

  const {
    scheduler: tesseractScheduler,
    loaded: tesseractSchedulerLoaded,
    error: tesseractSchedulerError,
    loadingProgress: tesseractLoadingProgress,
  } = useTesseract({
    workersNum,
    language,
  });

  const detectLinks = async (detectProps: DetectProps): Promise<DetectionPerformance | null> => {
    const {
      video,
      videoBrightness,
      videoContrast,
      resizeToSize,
      applyFilters,
      regionProposalsPadding,
      useRegionProposals,
    } = detectProps;

    logger.logDebug('detectLinks', detectProps);

    if (!modelRef.current) {
      const errMsg = 'Model is not ready for detection yet';
      logger.logError(errMsg);
      setDetectionError(errMsg);
      return null;
    }

    /* eslint-disable no-else-return */
    if (!tesseractSchedulerRef.current) {
      const errMsg = 'Tesseract is not loaded yet';
      logger.logError(errMsg);
      setDetectionError(errMsg);
      return null;
    } else if (tesseractSchedulerRef.current.getNumWorkers() !== workersNum) {
      const errMsg = 'Tesseract workers are not loaded yet';
      logger.logError(errMsg);
      setDetectionError(errMsg);
      return null;
    }

    onFrameProfiler.current.start();

    // Image preprocessing.
    const filters: FilterFunc[] = applyFilters ? [
      brightnessFilter(videoBrightness),
      contrastFilter(videoContrast),
      greyscaleFilter(),
    ] : [];

    preprocessingProfiler.current.start();
    let processedPixels: Pixels | null = null;
    try {
      processedPixels = preprocessPixels({
        pixels: video,
        resizeToSize,
        filters,
      });
    } catch (error) {
      const errMessage: string = (error && error.message) || 'Image preprocessing failed';
      logger.logError(errMessage);
      setDetectionError(errMessage);
    }
    if (!processedPixels) {
      return null;
    }
    setPixels(processedPixels);
    const imageProcessingTime = preprocessingProfiler.current.stop();

    // HTTPS prefixes detection model execution.
    inferenceProfiler.current.start();
    const httpsPredictions: DetectionBox[] | null = await graphModelExecute({
      model: modelRef.current,
      pixels: processedPixels,
      maxBoxesNum,
      scoreThreshold,
      iouThreshold,
    });
    const modelExecutionTime = inferenceProfiler.current.stop();
    setHttpsBoxes(httpsPredictions);

    // OCR execution.
    ocrProfiler.current.start();

    const rectanglesImage: Rectangle[] = [
      {
        left: 0,
        top: 0,
        width: processedPixels.width,
        height: processedPixels.height,
      },
    ];

    /* eslint-disable-next-line max-len */
    const rectanglesRegions: Rectangle[] = !useRegionProposals || !httpsPredictions || !httpsPredictions.length
      ? []
      : httpsPredictions.map((httpsPrediction: DetectionBox): Rectangle => {
        const { x1, y1, y2 } = httpsPrediction;

        const imageW: number = (processedPixels && processedPixels.width) || 0;
        const imageH: number = (processedPixels && processedPixels.height) || 0;

        const left: number = relativeToAbsolute(x1 - regionProposalsPadding, imageW);
        const top: number = relativeToAbsolute(y1 - regionProposalsPadding, imageH);
        const bottom: number = relativeToAbsolute(y2 + regionProposalsPadding, imageH);
        const width: number = imageW - left;
        const height: number = bottom - top;

        return {
          left,
          top,
          width,
          height,
        };
      });

    const rectangles: Rectangle[] = useRegionProposals ? rectanglesRegions : rectanglesImage;

    setRegionProposals(rectangles);

    logger.logDebug('detectLinks: tesseract is ready', {
      numWorkers: tesseractSchedulerRef.current.getNumWorkers(),
      rectangles: { ...rectangles },
    });

    if (rectangles.length) {
      const texts: Array<TesseractDetection | null> = await Promise.all(
        rectangles.map((rectangle: Rectangle): Promise<TesseractDetection | null> => {
          const recognizeOptions: Partial<RecognizeOptions> = { rectangle };
          if (!tesseractSchedulerRef.current) {
            return Promise.resolve(null);
          }
          return tesseractSchedulerRef.current.addJob(
            JobTypes.Recognize,
            processedPixels,
            recognizeOptions,
          );
        }),
      );
      if (texts && texts.length) {
        const currentDetectedLinks: Array<DetectedLink | null> = texts
          .map((text: TesseractDetection | null): DetectedLink | null => {
            return extractLinkFromDetection(text, logger);
          })
          .filter(
            (detection: DetectedLink | null): boolean => detection !== null,
          );
        // @ts-ignore
        setDetectedLinks(currentDetectedLinks);
      } else {
        setDetectedLinks([]);
      }
      logger.logDebug('recognized texts', { texts });
    } else {
      logger.logDebug('skipping the text recognition');
    }

    const ocrExecutionTime = ocrProfiler.current.stop();

    const onFrameTime = onFrameProfiler.current.stop();

    // Performance summary.
    const detectionPerformance: DetectionPerformance = {
      processing: imageProcessingTime,
      avgProcessing: preprocessingProfiler.current.avg(),
      inference: modelExecutionTime,
      avgInference: inferenceProfiler.current.avg(),
      ocr: ocrExecutionTime,
      avgOcr: ocrProfiler.current.avg(),
      total: onFrameTime,
      avgFps: onFrameProfiler.current.avgFps(),
      fps: onFrameProfiler.current.fps(),
    };
    logger.logDebugTable('onFrame', detectionPerformance);

    return detectionPerformance;
  };

  const detectLinksCallback = useCallback(detectLinks, [
    modelRef, iouThreshold, logger, maxBoxesNum, scoreThreshold, workersNum, tesseractSchedulerRef,
  ]);

  // Calculate the loading progress.
  useEffect(() => {
    const normalizedProgress: ZeroOneRange = toFloatFixed(
      (modelLoadingProgress + tesseractLoadingProgress) / 2,
      2,
    );
    logger.logDebug('useEffect: loading progress', {
      modelLoadingProgress,
      tesseractLoadingProgress,
      normalizedProgress,
      loadingProgress,
    });
    setLoadingProgress(normalizedProgress);
    setLoadingStage('Loading links detector');
  }, [loadingProgress, modelLoadingProgress, logger, tesseractLoadingProgress]);

  // Update model references.
  useEffect(() => {
    logger.logDebug('useEffect: Model');
    modelRef.current = model;
  }, [model, logger]);

  // Update tesseract scheduler references.
  useEffect(() => {
    logger.logDebug('useEffect: Tesseract Scheduler');
    if (!tesseractScheduler || !tesseractSchedulerLoaded) {
      return;
    }
    tesseractSchedulerRef.current = tesseractScheduler;
  }, [tesseractScheduler, logger, tesseractSchedulerLoaded]);

  return {
    detectedLinks,
    detectLinks: detectLinksCallback,
    loadingProgress,
    loadingStage,
    pixels,
    httpsBoxes,
    regionProposals,
    error: modelError || detectionError || tesseractSchedulerError,
  };
};

export default useLinksDetector;
