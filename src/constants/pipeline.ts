export const MODELS_BASE_URL = '';

export type DataPipeline = {
  loading: {
    linksDetectorModelURL: string,
  },
  preprocessing: {
    userPixels: {
      enabled: boolean,
      brightness: number, // [-1, 1]
      contrast: number, // [-1, 1]
    },
    modelPixels: {
      enabled: boolean,
      brightness: number, // [-1, 1]
      contrast: number, // [-1, 1]
    },
  },
  streaming: {
    idealFPS: number,
  },
  httpsDetection: {
    maxBoxesNum: number,
    IOUThreshold: number, // [0, 1]
    scoreThreshold: number, // [0, 1]
  },
};

export const DATA_PIPELINE: DataPipeline = {
  loading: {
    linksDetectorModelURL: `${MODELS_BASE_URL}/models/links_detector/model.json`,
  },
  preprocessing: {
    userPixels: {
      enabled: true,
      brightness: 0.2,
      contrast: 0.2,
    },
    modelPixels: {
      enabled: true,
      brightness: 0.2,
      contrast: 0.2,
    },
  },
  streaming: {
    idealFPS: 0.5,
  },
  httpsDetection: {
    maxBoxesNum: 10,
    IOUThreshold: 0.5,
    scoreThreshold: 0.1,
  },
};
