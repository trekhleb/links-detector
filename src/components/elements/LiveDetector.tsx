import React, { CSSProperties, useRef, useState } from 'react';

import CameraStream from '../shared/CameraStream';
import useWindowSize from '../../hooks/useWindowSize';
import useGraphModel from '../../hooks/useGraphModel';
import { DATA_PIPELINE } from '../../constants/pipeline';
import Notification, { NotificationLevel } from '../shared/Notification';
import useLogger from '../../hooks/useLogger';
import ProgressBar from '../shared/ProgressBar';
import { DetectionBox, graphModelExecute } from '../../utils/graphModelExecute';
import BoxesCanvas from './BoxesCanvas';
import { isDebugMode } from '../../constants/debug';
import ErrorBoundary from '../shared/ErrorBoundary';
import PixelsCanvas from './PixelsCanvas';
import {
  brightnessFilter,
  FilterFunc,
  greyscaleFilter,
  Pixels,
  preprocessPixels,
  contrastFilter,
} from '../../utils/image';
import { newProfiler, Profiler } from '../../utils/profiler';

const userVideoBrightness = 1 + DATA_PIPELINE.preprocessing.userPixels.brightness;
const userVideoContrast = 1 + DATA_PIPELINE.preprocessing.userPixels.contrast;

const modelVideoBrightness = DATA_PIPELINE.preprocessing.modelPixels.brightness;
const modelVideoContrast = DATA_PIPELINE.preprocessing.modelPixels.contrast;

const videoStyle: CSSProperties = DATA_PIPELINE.preprocessing.userPixels.enabled ? {
  filter: `brightness(${userVideoBrightness}) contrast(${userVideoContrast}) grayscale(1)`,
} : {};

function LiveDetector(): React.ReactElement | null {
  const preprocessingProfiler = useRef<Profiler>(newProfiler());
  const inferenceProfiler = useRef<Profiler>(newProfiler());
  const [pixels, setPixels] = useState<Pixels | null>(null);
  const logger = useLogger({ context: 'LiveDetector' });
  const [boxes, setBoxes] = useState<DetectionBox[] | null>(null);
  const windowSize = useWindowSize();
  const {
    model,
    error: modelError,
    loadingProgress: modelLoadingProgress,
  } = useGraphModel({
    modelURL: DATA_PIPELINE.loading.linksDetectorModelURL,
    warmup: true,
  });

  if (!model) {
    if (modelError) {
      return (
        <Notification level={NotificationLevel.DANGER}>
          {modelError}
        </Notification>
      );
    }
    const loadingText = modelLoadingProgress === 1 ? 'Warming up link detector' : 'Loading link detector';
    return (
      <ProgressBar progress={modelLoadingProgress * 100} text={loadingText} />
    );
  }

  if (!windowSize || !windowSize.width || !windowSize.height) {
    return <ProgressBar text="Detecting the window size" />;
  }

  const videoSize: number = Math.min(windowSize.width, windowSize.height);

  const onFrame = async (video: HTMLVideoElement): Promise<void> => {
    // Image preprocessing.
    const filters: FilterFunc[] = DATA_PIPELINE.preprocessing.modelPixels.enabled ? [
      brightnessFilter(modelVideoBrightness),
      contrastFilter(modelVideoContrast),
      greyscaleFilter(),
    ] : [];
    preprocessingProfiler.current.start();
    const processedPixels = preprocessPixels(video, filters);
    setPixels(processedPixels);
    const imageProcessingTime = preprocessingProfiler.current.stop();

    // Model execution.
    inferenceProfiler.current.start();
    const predictions: DetectionBox[] | null = await graphModelExecute({
      model,
      pixels: processedPixels,
      maxBoxesNum: DATA_PIPELINE.httpsDetection.maxBoxesNum,
      scoreThreshold: DATA_PIPELINE.httpsDetection.scoreThreshold,
      iouThreshold: DATA_PIPELINE.httpsDetection.IOUThreshold,
    });
    const modelExecutionTime = inferenceProfiler.current.stop();
    setBoxes(predictions);

    logger.logDebug('onFrame', {
      imageProcessingTime,
      modelExecutionTime,
    });
  };

  const canvasContainerStyles: CSSProperties = {
    marginTop: `-${videoSize}px`,
    position: 'relative',
  };

  const boxesCanvas = boxes && isDebugMode() ? (
    <ErrorBoundary>
      <div style={canvasContainerStyles}>
        <BoxesCanvas
          boxes={boxes}
          width={videoSize}
          height={videoSize}
        />
      </div>
    </ErrorBoundary>
  ) : null;

  const imageCanvas = isDebugMode() ? (
    <ErrorBoundary>
      <div style={canvasContainerStyles}>
        <PixelsCanvas
          pixels={pixels}
          width={videoSize}
          height={videoSize}
        />
      </div>
    </ErrorBoundary>
  ) : null;

  return (
    <div>
      <ErrorBoundary>
        <CameraStream
          onFrame={onFrame}
          width={videoSize}
          height={videoSize}
          videoStyle={videoStyle}
          idealFrameRate={DATA_PIPELINE.streaming.idealFPS}
        />
      </ErrorBoundary>
      { imageCanvas }
      { boxesCanvas }
    </div>
  );
}

export default LiveDetector;
