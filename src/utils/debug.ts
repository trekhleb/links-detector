import * as tf from '@tensorflow/tfjs';

type TFInfoProps = {
  modelURL: string,
};

export type TFInfo = {
  platformName: string,
  backendName: string,
};

export const getTFInfo = async (props: TFInfoProps): Promise<TFInfo> => {
  const { modelURL } = props;

  await tf.loadGraphModel(modelURL);

  return {
    platformName: tf.env().platformName,
    backendName: tf.engine().backendName,
  };
};
