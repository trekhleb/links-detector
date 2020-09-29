import * as tf from '@tensorflow/tfjs';
import { PixelData } from '@tensorflow/tfjs-core/src/types';

import { buildLoggers } from './logger';
import { msToSs } from './time';

type ModelPredictions = {
  detectionsNum: number,
  detectionScores: number[],
  detectionClasses: number[],
  detectionBoxes: number[][],
};

export type DetectionBox = {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  score: number,
  categoryId: number,
};

// @see: https://js.tensorflow.org/api/latest/#image.nonMaxSuppressionAsync
const DEFAULT_MAX_BOXES_NUM = 10;
const DEFAULT_IOU_THRESHOLD = 0.5;
const DEFAULT_SCORE_THRESHOLD = -Infinity;

type GraphModelExecuteProps = {
  model: tf.GraphModel,
  pixels: PixelData | ImageData| HTMLImageElement | HTMLCanvasElement| HTMLVideoElement,
  maxBoxesNum?: number,
  iouThreshold?: number,
  scoreThreshold?: number,
};

export const graphModelExecute = async (
  props: GraphModelExecuteProps,
): Promise<DetectionBox[] | null> => {
  const {
    model,
    pixels,
    maxBoxesNum = DEFAULT_MAX_BOXES_NUM,
    iouThreshold = DEFAULT_IOU_THRESHOLD,
    scoreThreshold = DEFAULT_SCORE_THRESHOLD,
  } = props;

  const logger = buildLoggers({ context: 'graphModelExecute' });

  if (!model || !pixels) {
    logger.logError('executeModel: model or video is undefined');
    return null;
  }

  const inputTensor: tf.Tensor3D = tf.browser.fromPixels(pixels).expandDims(0);

  let results: tf.Tensor | tf.Tensor[] | null = null;

  try {
    const t0 = tf.util.now();
    results = await model.executeAsync(inputTensor);
    const inferenceTimeMs = tf.util.now() - t0;
    logger.logDebug('executeModel: executing', {
      inputTensorShape: inputTensor.shape,
      inferenceTime: msToSs(inferenceTimeMs),
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

  // Each entry is [y1, x1, y2, x2], where (y1, x1) and (y2, x2) are
  // the corners of the bounding box.
  const detectionBoxes: number[][] = await tf.broadcastTo<tf.Rank.R2>(
    tf.squeeze(results[DETECTIONS_BOXES_INDEX]),
    [detectionsNum, 4],
  ).array();

  const importantBoxesIndicesTensor: tf.Tensor1D = await tf.image.nonMaxSuppressionAsync(
    detectionBoxes,
    detectionScores,
    maxBoxesNum,
    iouThreshold,
    scoreThreshold,
  );

  const importantBoxesIndices: Int32Array = await importantBoxesIndicesTensor.data<'int32'>();

  const boxes: DetectionBox[] = importantBoxesIndices.reduce<DetectionBox[]>(
    (tmpBoxes: DetectionBox[], boxIndex: number) => {
      tmpBoxes.push({
        x1: detectionBoxes[boxIndex][1],
        y1: detectionBoxes[boxIndex][0],
        x2: detectionBoxes[boxIndex][3],
        y2: detectionBoxes[boxIndex][2],
        score: detectionScores[boxIndex],
        categoryId: detectionClasses[boxIndex],
      });
      return tmpBoxes;
    },
    [],
  );

  const modelPredictions: ModelPredictions = {
    detectionsNum,
    detectionClasses,
    detectionBoxes,
    detectionScores,
  };

  logger.logDebug('executeModel: parsed results', {
    modelPredictions,
    importantBoxesIndices,
    boxes,
  });

  return boxes;
};
