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

export const isWebGLSupported = (): boolean => {
  try {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    return !!window.WebGLRenderingContext
      && (
        !!canvas.getContext('webgl')
        || !!canvas.getContext('experimental-webgl')
      );
  } catch (e) {
    return false;
  }
};

export const isCanvasFilterSupported = (): boolean => {
  try {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!context) {
      return false;
    }
    if (!context.filter) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};
