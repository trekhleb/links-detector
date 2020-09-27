import { useState, useEffect, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';

import useLogger from './useLogger';
import { graphModelWarmup } from '../utils/graphModelWarmup';
import { graphModelLoad } from '../utils/graphModelLoad';

type UseGraphModelProps = {
  modelURL: string,
  warmup?: boolean,
};

type UseGraphModelOutput = {
  model: tf.GraphModel | null,
  error: string | null,
  loadingProgress: number,
};

const useGraphModel = (props: UseGraphModelProps): UseGraphModelOutput => {
  const { modelURL, warmup = false } = props;

  const logger = useLogger({ context: 'useGraphModel' });

  const [model, setModel] = useState<tf.GraphModel | null>(null);
  const [isWarm, setIsWarm] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  const warmupGraphModel = async (): Promise<void> => {
    if (!warmup || !model || isWarm) {
      return;
    }
    await graphModelWarmup(model);
  };

  const warmupCallback = useCallback(
    warmupGraphModel,
    [warmup, model, isWarm],
  );

  const onLoadingProgress = (progress: number): void => {
    logger.logDebug('onLoadingProgress', { progress });
    setLoadingProgress(progress);
  };

  const onLoadingProgressCallback = useCallback(onLoadingProgress, [logger]);

  // Effect for loading a model.
  useEffect(() => {
    logger.logDebug('useEffect: loading the model');
    graphModelLoad(modelURL, onLoadingProgressCallback)
      .then((graphModel: tf.GraphModel) => {
        setModel(graphModel);
      })
      .catch((e: Error) => {
        setError(e.message);
        logger.logError(`Cannot load the model: ${e.message}`);
      });
  }, [modelURL, setError, setModel, logger, onLoadingProgressCallback]);

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

  let finalModel: tf.GraphModel | null = model;
  if (warmup) {
    finalModel = isWarm ? model : null;
  }

  return {
    model: finalModel,
    loadingProgress,
    error,
  };
};

export default useGraphModel;
