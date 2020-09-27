import * as tf from '@tensorflow/tfjs';
import { buildLoggers } from './logger';

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
