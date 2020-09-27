import * as tf from '@tensorflow/tfjs';
import { DataType } from '@tensorflow/tfjs-core/src/types';
import { buildLoggers } from './logger';

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
