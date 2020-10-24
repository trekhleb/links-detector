import * as tf from '@tensorflow/tfjs';
import {
  ConfigResult,
  DetectResult,
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
};

export type UseLinkDetectorOutput = {
  detectLinks: (props: DetectProps) => Promise<DetectionPerformance | null>,
  error: string | null,
  loadingProgress: ZeroOneRange | null,
  loadingStage: string | null,
  httpsBoxes: DetectionBox[] | null,
  regionProposals: Rectangle[],
  pixels: Pixels | null,
};

export type TesseractDetection = ConfigResult | RecognizeResult | DetectResult;

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

  const modelRef = useRef<tf.GraphModel | null>(null);
  const tesseractSchedulerRef = useRef<Scheduler | null>(null);

  const logger = useLogger({ context: 'useLinksDetector' });

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

    const rectangles: Rectangle[] = !httpsPredictions || !httpsPredictions.length
      ? []
      : httpsPredictions.map((httpsPrediction: DetectionBox): Rectangle => {
        const { x1, y1, y2 } = httpsPrediction;

        const imageW: number = (processedPixels && processedPixels.width) || 0;
        const imageH: number = (processedPixels && processedPixels.height) || 0;

        const left: number = relativeToAbsolute(x1, imageW);
        const top: number = relativeToAbsolute(y1, imageH);
        const bottom: number = relativeToAbsolute(y2, imageH);
        const width: number = imageW - left;
        const height: number = bottom - top;

        return {
          left,
          top,
          width,
          height,
        };
      });

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
