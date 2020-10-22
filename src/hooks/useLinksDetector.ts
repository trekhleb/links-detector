import * as tf from '@tensorflow/tfjs';
import {
  ConfigResult,
  DetectResult,
  RecognizeResult,
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
  greyscaleFilter, Pixels,
  preprocessPixels,
} from '../utils/image';
import { JobTypes } from '../utils/tesseract';

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
  applyFilters: boolean,
};

export type UseLinkDetectorOutput = {
  detectLinks: (props: DetectProps) => Promise<void>,
  error: string | null,
  loadingProgress: ZeroOneRange | null,
  loadingStage: string | null,
  httpsBoxes: DetectionBox[] | null,
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

  // @TODO: Use model instead of modelRef if possible (issue with detectLinksCallback).
  const modelRef = useRef<tf.GraphModel | null>(null);
  const tesseractSchedulerRef = useRef<Scheduler | null>(null);

  const logger = useLogger({ context: 'useLinksDetector' });

  const [pixels, setPixels] = useState<Pixels | null>(null);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const [httpsBoxes, setHttpsBoxes] = useState<DetectionBox[] | null>(null);
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
    loadingProgress: tesseractLoadingProgress,
  } = useTesseract({
    workersNum,
    language,
  });

  const detectLinks = async (detectProps: DetectProps): Promise<void> => {
    const {
      video,
      videoBrightness,
      videoContrast,
      applyFilters,
    } = detectProps;

    logger.logDebug('detectLinks', detectProps);

    if (!modelRef.current) {
      const errMsg = 'Model is not ready for detection yet';
      logger.logError(errMsg);
      setDetectionError(errMsg);
      return;
    }

    if (!tesseractSchedulerRef.current) {
      const errMsg = 'Tesseract is not loaded yet';
      logger.logError(errMsg);
      setDetectionError(errMsg);
      return;
    } else if (tesseractSchedulerRef.current.getNumWorkers() !== workersNum) {
      const errMsg = 'Tesseract workers are not loaded yet';
      logger.logError(errMsg);
      setDetectionError(errMsg);
      return;
    }

    onFrameProfiler.current.start();

    // Image preprocessing.
    const filters: FilterFunc[] = applyFilters ? [
      brightnessFilter(videoBrightness),
      contrastFilter(videoContrast),
      greyscaleFilter(),
    ] : [];

    preprocessingProfiler.current.start();
    const processedPixels = preprocessPixels(video, filters);
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

    logger.logDebug('detectLinks: tesseract is ready', {
      numWorkers: tesseractSchedulerRef.current.getNumWorkers(),
    });

    const texts: TesseractDetection = await tesseractSchedulerRef.current.addJob(
      JobTypes.Recognize,
      processedPixels,
    );
    logger.logDebug('recognized text', { texts });

    const ocrExecutionTime = ocrProfiler.current.stop();

    const onFrameTime = onFrameProfiler.current.stop();

    // Performance summary.
    logger.logDebugTable('onFrame', {
      processing: imageProcessingTime,
      avgProcessing: preprocessingProfiler.current.avg(),
      inference: modelExecutionTime,
      avgInference: inferenceProfiler.current.avg(),
      ocr: ocrExecutionTime,
      avgOcr: ocrProfiler.current.avg(),
      total: onFrameTime,
      avgFps: onFrameProfiler.current.avgFps(),
      fps: onFrameProfiler.current.fps(),
    });
  };

  const detectLinksCallback = useCallback(detectLinks, [
    modelRef, iouThreshold, logger, maxBoxesNum, scoreThreshold, workersNum, tesseractSchedulerRef,
  ]);

  // Calculate the loading progress.
  useEffect(() => {
    logger.logDebug('useEffect: Loading progress', { modelLoadingProgress, loadingProgress });
    if (loadingProgress === modelLoadingProgress) {
      return;
    }
    setLoadingProgress(modelLoadingProgress);
    setLoadingStage('Loading links detector');
  }, [loadingProgress, modelLoadingProgress, logger]);

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
    error: modelError || detectionError,
  };
};

export default useLinksDetector;
