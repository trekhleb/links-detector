import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';

import CameraStream from '../shared/CameraStream';
import useWindowSize from '../../hooks/useWindowSize';
import useGraphModel from '../../hooks/useGraphModel';
import { LINKS_DETECTOR_MODEL_URL } from '../../constants/models';
import Notification, { NotificationLevel } from '../shared/Notification';
import useLogger from '../../hooks/useLogger';
import ProgressBar from '../shared/ProgressBar';

function LiveDetector(): React.ReactElement | null {
  const logger = useLogger({ context: 'LiveDetector' });
  const windowSize = useWindowSize();
  const {
    model,
    error: modelError,
    loadingProgress: modelLoadingProgress,
  } = useGraphModel({
    modelURL: LINKS_DETECTOR_MODEL_URL,
    warmup: true,
  });

  const [error, setError] = useState<string | null>(null);

  if (!model) {
    if (modelError) {
      return (
        <Notification level={NotificationLevel.DANGER}>
          {modelError}
        </Notification>
      );
    }
    const loadingText = modelLoadingProgress === 1 ? 'Preparing link detector' : 'Loading link detector';
    return (
      <ProgressBar progress={modelLoadingProgress * 100} text={loadingText} />
    );
  }

  if (!windowSize || !windowSize.width || !windowSize.height) {
    return <ProgressBar text="Detecting the window size" />;
  }

  const videoSize: number = Math.min(windowSize.width, windowSize.height);

  const executeModel = async (video: HTMLVideoElement): Promise<null> => {
    if (!model || !video) {
      logger.logError('executeModel: model or video is undefined');
      return null;
    }
    const inputTensor: tf.Tensor3D = tf.browser.fromPixels(video).expandDims(0);

    let result: tf.Tensor | tf.Tensor[];

    try {
      logger.logDebug('executeModel: executing', {
        inputTensorShape: inputTensor.shape,
      });
      result = await model.executeAsync(inputTensor);
      logger.logDebug('executeModel: executed', {
        result,
      });
    } catch (e) {
      const errorMessage = (e && e.message) || 'Cannot execute the model';
      logger.logError(errorMessage);
      setError(errorMessage);
    }

    return null;
  };

  const onFrame = async (video: HTMLVideoElement): Promise<void> => {
    const predictions = await executeModel(video);
  };

  return (
    <div>
      <CameraStream
        onFrame={onFrame}
        width={videoSize}
        height={videoSize}
      />
    </div>
  );
}

export default LiveDetector;
