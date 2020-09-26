import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';

import CameraStream from '../shared/CameraStream';
import useWindowSize from '../../hooks/useWindowSize';
import useGraphModel from '../../hooks/useGraphModel';
import { LINKS_DETECTOR_MODEL_URL } from '../../constants/models';
import Notification, { NotificationLevel } from '../shared/Notification';
import useLogger from '../../hooks/useLogger';
import ProgressBar from '../shared/ProgressBar';

type ModelPredictions = {
  detectionsNum: number,
  detectionScores: number[],
  detectionClasses: number[],
  detectionBoxes: number[][],
};

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
    const loadingText = modelLoadingProgress === 1 ? 'Warming up link detector' : 'Loading link detector';
    return (
      <ProgressBar progress={modelLoadingProgress * 100} text={loadingText} />
    );
  }

  if (!windowSize || !windowSize.width || !windowSize.height) {
    return <ProgressBar text="Detecting the window size" />;
  }

  const videoSize: number = Math.min(windowSize.width, windowSize.height);

  const executeModel = async (video: HTMLVideoElement): Promise<ModelPredictions | null> => {
    if (!model || !video) {
      logger.logError('executeModel: model or video is undefined');
      return null;
    }
    const inputTensor: tf.Tensor3D = tf.browser.fromPixels(video).expandDims(0);

    let results: tf.Tensor | tf.Tensor[] | null = null;

    try {
      results = await model.executeAsync(inputTensor);
      logger.logDebug('executeModel: executing', {
        inputTensorShape: inputTensor.shape,
        results,
      });
    } catch (e) {
      const errorMessage = (e && e.message) || 'Cannot execute the model';
      logger.logError(errorMessage);
      setError(errorMessage);
    }

    if (!results) {
      logger.logError('executeModel: model results are empty');
      return null;
    }

    if (!Array.isArray(results)) {
      logger.logError('executeModel: expected an array of Tensors, got one Tensor', {
        results,
      });
      return null;
    }

    const DETECTIONS_NUM_INDEX = 2;
    const DETECTIONS_CLASSES_INDEX = 5;
    const DETECTIONS_BOXES_INDEX = 0;
    const DETECTIONS_SCORES_INDEX = 6;

    const detectionsNum: number = tf.util.flatten(
      results[DETECTIONS_NUM_INDEX].arraySync(),
    )[0];

    const detectionClasses: number[] = await tf.broadcastTo<tf.Rank.R1>(
      tf.squeeze(results[DETECTIONS_CLASSES_INDEX]),
      [detectionsNum],
    ).array();

    const detectionScores: number[] = await tf.broadcastTo<tf.Rank.R1>(
      tf.squeeze(results[DETECTIONS_SCORES_INDEX]),
      [detectionsNum],
    ).array();

    const detectionBoxes: number[][] = await tf.broadcastTo<tf.Rank.R2>(
      tf.squeeze(results[DETECTIONS_BOXES_INDEX]),
      [detectionsNum, 4],
    ).array();

    const modelPredictions: ModelPredictions = {
      detectionsNum,
      detectionClasses,
      detectionBoxes,
      detectionScores,
    };

    logger.logDebug('executeModel: parsed results', modelPredictions);

    return modelPredictions;
  };

  const onFrame = async (video: HTMLVideoElement): Promise<void> => {
    const predictions: ModelPredictions | null = await executeModel(video);
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
