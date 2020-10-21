import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as tf from '@tensorflow/tfjs';

import { ZeroOneRange } from '../utils/types';
import useGraphModel from './useGraphModel';
import { newProfiler, Profiler } from '../utils/profiler';
import {
  brightnessFilter,
  contrastFilter,
  FilterFunc,
  greyscaleFilter, Pixels,
  preprocessPixels,
} from '../utils/image';
import { DetectionBox, graphModelExecute } from '../utils/graphModel';
import useLogger from './useLogger';

export type UseLinkDetectorProps = {
  modelURL: string,
  maxBoxesNum: number,
  scoreThreshold: number,
  iouThreshold: number,
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

const useLinksDetector = (props: UseLinkDetectorProps): UseLinkDetectorOutput => {
  const {
    modelURL,
    iouThreshold,
    maxBoxesNum,
    scoreThreshold,
  } = props;

  const preprocessingProfiler = useRef<Profiler>(newProfiler());
  const inferenceProfiler = useRef<Profiler>(newProfiler());
  const onFrameProfiler = useRef<Profiler>(newProfiler());

  // @TODO: Use model instead of modelRef if possible (issue with detectLinksCallback).
  const modelRef = useRef<tf.GraphModel | null>(null);

  const logger = useLogger({ context: 'useLinksDetector' });

  const [pixels, setPixels] = useState<Pixels | null>(null);
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

  const detectLinks = async (detectProps: DetectProps): Promise<void> => {
    const {
      video,
      videoBrightness,
      videoContrast,
      applyFilters,
    } = detectProps;
    logger.logDebug('detectLinks', detectProps);

    // console.log('++++++', { model });

    if (!modelRef.current) {
      logger.logError('Model is not ready for detection yet');
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

    // Model execution.
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

    const onFrameTime = onFrameProfiler.current.stop();

    logger.logDebug('onFrame', {
      procT: imageProcessingTime,
      avgProcT: preprocessingProfiler.current.avg(),
      execT: modelExecutionTime,
      avgExecT: inferenceProfiler.current.avg(),
      onFrameT: onFrameTime,
      avgFps: onFrameProfiler.current.fps(),
    });
  };

  const detectLinksCallback = useCallback(detectLinks, [
    modelRef, iouThreshold, logger, maxBoxesNum, scoreThreshold,
  ]);

  // Calculate the loading progress.
  useEffect(() => {
    logger.logDebug('useEffect: Loading progress', { modelLoadingProgress, loadingProgress });
    if (loadingProgress === modelLoadingProgress) {
      return;
    }
    setLoadingProgress(modelLoadingProgress);
    setLoadingStage('Loading the model');
  }, [loadingProgress, modelLoadingProgress, logger]);

  // Update model references.
  useEffect(() => {
    logger.logDebug('useEffect: Model');
    modelRef.current = model;
  }, [model, logger]);

  return {
    detectLinks: detectLinksCallback,
    loadingProgress,
    loadingStage,
    pixels,
    httpsBoxes,
    error: modelError,
  };
};

export default useLinksDetector;
