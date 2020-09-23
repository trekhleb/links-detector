import { useState, useEffect, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import { GraphModel } from '@tensorflow/tfjs';
import { DataType } from '@tensorflow/tfjs-core/src/types';
import useLogger from './useLogger';

type UseGraphModelProps = {
  modelURL: string,
  warmup?: boolean,
};

type UseGraphModelOutput = {
  model: GraphModel | null,
  error: string | null,
};

const useGraphModel = (props: UseGraphModelProps): UseGraphModelOutput => {
  const { modelURL, warmup = false } = props;

  const logger = useLogger({ context: 'useGraphModel' });

  const [model, setModel] = useState<GraphModel | null>(null);
  const [isWarm, setIsWarm] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const warmupModel = async (): Promise<void> => {
    if (!warmup || !model || isWarm) {
      return;
    }
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
    await model.executeAsync(fakeInput);
    logger.logDebug('Model is wormed up');
  };

  const warmupCallback = useCallback(warmupModel, [model, isWarm]);

  // Effect for loading a model.
  useEffect(() => {
    logger.logDebug('useEffect: loading the model');
    tf.loadGraphModel(modelURL)
      .then((graphModel: GraphModel) => {
        setModel(graphModel);
        logger.logDebug('Model is loaded');
      })
      .catch((e: Error) => {
        setError(e.message);
        logger.logError(`Cannot load the model: ${e.message}`);
      });
  }, [modelURL, setError, setModel, logger]);

  // Effect for warming up a model.
  useEffect(() => {
    if (!warmup || !model || isWarm) {
      return;
    }
    logger.logDebug('useEffect: warming up the model');
    warmupCallback().then(() => {
      setIsWarm(true);
    });
  }, [
    model,
    warmup,
    isWarm,
    setIsWarm,
    warmupCallback,
    logger,
  ]);

  let finalModel: GraphModel | null = model;
  if (warmup) {
    finalModel = isWarm ? model : null;
  }

  return {
    model: finalModel,
    error,
  };
};

export default useGraphModel;
