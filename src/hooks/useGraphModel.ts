import { useState, useEffect, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';

import useLogger from './useLogger';
import { graphModelLoad, graphModelWarmup } from '../utils/graphModel';
import { ZeroOneRange } from '../utils/types';

type UseGraphModelProps = {
  modelURL: string,
  warmup?: boolean,
};

type UseGraphModelOutput = {
  model: tf.GraphModel | null,
  error: string | null,
  loadingProgress: ZeroOneRange,
};

const useGraphModel = (props: UseGraphModelProps): UseGraphModelOutput => {
  const { modelURL, warmup = false } = props;

  const logger = useLogger({ context: 'useGraphModel' });

  const [model, setModel] = useState<tf.GraphModel | null>(null);
  const [isWarm, setIsWarm] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<ZeroOneRange>(0);

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

  const calculateLoadingProgress = (progress: ZeroOneRange): ZeroOneRange => {
    if (!warmup) {
      return progress;
    }
    // In case of model warm up we need to reserve some percentage of loader for warming up.
    const warmupLoadingRatio = 0.02;
    return (1 - warmupLoadingRatio) * progress;
  };

  const onLoadingProgress = (progress: ZeroOneRange): void => {
    logger.logDebug('onLoadingProgress', { progress });
    setLoadingProgress(calculateLoadingProgress(progress));
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
      setLoadingProgress(1);
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
