import { useState, useEffect, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import { GraphModel } from '@tensorflow/tfjs';
import { DataType } from '@tensorflow/tfjs-core/src/types';

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

  const [model, setModel] = useState<GraphModel | null>(null);
  const [isWarm, setIsWarm] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const warmupModel = async (): Promise<void> => {
    if (!warmup || !model || isWarm) {
      return;
    }
    const inputShapeWithNulls = model.inputs[0].shape;
    if (!inputShapeWithNulls) {
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
  };

  const warmupCallback = useCallback(warmupModel, [model, isWarm]);

  // Effect for loading a model.
  useEffect(() => {
    tf.loadGraphModel(modelURL)
      .then((graphModel: GraphModel) => {
        setModel(graphModel);
      })
      .catch((e: Error) => {
        setError(e.message);
      });
  }, [modelURL, setError, setModel]);

  // Effect for warming up a model.
  useEffect(() => {
    if (!warmup || !model || isWarm) {
      return;
    }
    warmupCallback().then(() => {
      setIsWarm(true);
    });
  }, [
    model,
    warmup,
    isWarm,
    setIsWarm,
    warmupCallback,
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
