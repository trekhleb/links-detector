import * as tf from '@tensorflow/tfjs';
import { DataType } from '@tensorflow/tfjs-core/src/types';

import { buildLoggers } from './logger';
import { Pixels } from './image';
import { newProfiler, Profiler } from './profiler';

export const graphModelLoad = async (
  modelURL: string,
  onProgress: (progress: number) => void,
): Promise<tf.GraphModel> => {
  const logger = buildLoggers({ context: 'graphModelLoad' });

  const model: tf.GraphModel = await tf.loadGraphModel(modelURL, { onProgress });

  logger.logDebug('Model is loaded', {
    backendName: tf.engine().backendName,
    platformName: tf.env().platformName,
    model,
    backend: tf.engine().backend,
    features: tf.env().features,
  });

  return model;
};

export const graphModelWarmup = async (
  model: tf.GraphModel,
): Promise<void> => {
  if (!model) {
    return;
  }

  const logger = buildLoggers({ context: 'graphModelWarmup' });

  const inputShapeWithNulls = model.inputs[0].shape;

  if (!inputShapeWithNulls) {
    logger.logWarn('Cannot warmup the model: unknown input shape');
    return;
  }

  const inputShape = inputShapeWithNulls.map((dimension: number) => {
    if (dimension === null || dimension === -1) {
      return 1;
    }
    return dimension;
  });

  const dataType: DataType = 'int32';
  const fakeInput = tf.zeros(inputShape, dataType);

  logger.logDebug('warmupModel', { inputShape, fakeInput });

  await model.executeAsync(fakeInput);

  logger.logDebug('Model is wormed up');
};

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

type GraphModelExecuteProps = {
  model: tf.GraphModel,
  pixels: Pixels,
  maxBoxesNum: number,
  iouThreshold: number,
  scoreThreshold: number,
};

export const graphModelExecute = async (
  props: GraphModelExecuteProps,
): Promise<DetectionBox[] | null> => {
  const {
    model,
    pixels,
    maxBoxesNum,
    iouThreshold,
    scoreThreshold,
  } = props;

  const profiler: Profiler = newProfiler();

  const logger = buildLoggers({ context: 'graphModelExecute' });

  if (!model || !pixels) {
    logger.logError('executeModel: model or video is undefined');
    return null;
  }

  const inputTensor: tf.Tensor3D = tf.browser.fromPixels(pixels).expandDims(0);

  let results: tf.Tensor | tf.Tensor[] | null = null;

  try {
    profiler.start();
    results = await model.executeAsync(inputTensor);
    const inferenceTime = profiler.stop();
    logger.logDebug('executeModel: executing', {
      inputTensorShape: inputTensor.shape,
      inferenceTime,
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
