import React, { useState } from 'react';

import CameraStream from '../shared/CameraStream';
import useWindowSize from '../../hooks/useWindowSize';
import useGraphModel from '../../hooks/useGraphModel';
import { LINKS_DETECTOR_MODEL_URL } from '../../constants/models';
import Notification, { NotificationLevel } from '../shared/Notification';
import useLogger from '../../hooks/useLogger';
import ProgressBar from '../shared/ProgressBar';
import { DetectionBox, graphModelExecute } from '../../utils/graphModelExecute';
import BoxesCanvas from './BoxesCanvas';
import { isDebugMode } from '../../constants/debugging';
import ErrorBoundary from '../shared/ErrorBoundary';
import ImageCanvas, { CanvasImageSource } from './ImageCanvas';
import { msToSs } from '../../utils/time';

const SCORE_THRESHOLD = 0.1;

function LiveDetector(): React.ReactElement | null {
  const [imageSrc, setImageSrc] = useState<CanvasImageSource | null>(null);
  const logger = useLogger({ context: 'LiveDetector' });
  const [boxes, setBoxes] = useState<DetectionBox[] | null>(null);
  const windowSize = useWindowSize();
  const {
    model,
    error: modelError,
    loadingProgress: modelLoadingProgress,
  } = useGraphModel({
    modelURL: LINKS_DETECTOR_MODEL_URL,
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
    setImageSrc(video);

    // Model execution.
    const executionTimeStart = Date.now();
    const predictions: DetectionBox[] | null = await graphModelExecute({
      model,
      video,
      scoreThreshold: SCORE_THRESHOLD,
    });
    const executionTime = msToSs(Date.now() - executionTimeStart);
    setBoxes(predictions);

    logger.logDebug('onFrame', { executionTime });
  };

  const canvasContainerStyles = {
    marginTop: `-${videoSize}px`,
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
        <ImageCanvas
          imageSrc={imageSrc}
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
        />
      </ErrorBoundary>
      { imageCanvas }
      { boxesCanvas }
    </div>
  );
}

export default LiveDetector;
