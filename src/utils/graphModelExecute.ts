import * as tf from '@tensorflow/tfjs';
import { buildLoggers } from './logger';

type ModelPredictions = {
  detectionsNum: number,
  detectionScores: number[],
  detectionClasses: number[],
  detectionBoxes: number[][],
};

export const graphModelExecute = async (
  model: tf.GraphModel,
  video: HTMLVideoElement,
): Promise<ModelPredictions | null> => {
  const logger = buildLoggers({ context: 'graphModelExecute' });

  if (!model || !video) {
    logger.logError('executeModel: model or video is undefined');
    return null;
  }

  const inputTensor: tf.Tensor3D = tf.browser.fromPixels(video).expandDims(0);

  let results: tf.Tensor | tf.Tensor[] | null = null;

  try {
    const t0 = tf.util.now();
    results = await model.executeAsync(inputTensor);
    const inferenceTimeMs = tf.util.now() - t0;
    logger.logDebug('executeModel: executing', {
      inputTensorShape: inputTensor.shape,
      inferenceTimeS: (inferenceTimeMs / 1000).toFixed(2),
      results,
    });
  } catch (e) {
    const errorMessage = (e && e.message) || 'Cannot execute the model';
    logger.logError(errorMessage);
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
