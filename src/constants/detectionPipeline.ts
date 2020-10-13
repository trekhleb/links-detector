export const MODELS_BASE_URL = '';

export type DetectionPipeline = {
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
  ocr: {
    workersNum: number,
    language: string,
  },
};

export const DETECTION_PIPELINE: DetectionPipeline = {
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
    // @see: https://js.tensorflow.org/api/latest/#image.nonMaxSuppressionAsync
    maxBoxesNum: 5,
    IOUThreshold: 0.5,
    scoreThreshold: 0.1,
  },
  ocr: {
    // @see: https://github.com/naptha/tesseract.js/blob/master/docs/examples.md
    workersNum: 5,
    language: 'eng',
  },
};
