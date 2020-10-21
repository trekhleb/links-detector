import { ZeroOneRange } from '../utils/types';

export const MODELS_BASE_URL = '';

export type DetectionConfig = {
  modelLoading: {
    linksDetectorModelURL: string,
  },
  imagePreprocessing: {
    ui: {
      enabled: boolean,
      brightness: ZeroOneRange,
      contrast: ZeroOneRange,
    },
    model: {
      enabled: boolean,
      brightness: ZeroOneRange,
      contrast: ZeroOneRange,
    },
  },
  videoStreaming: {
    idealFPS: number,
  },
  httpsDetection: {
    maxBoxesNum: number,
    IOUThreshold: ZeroOneRange,
    scoreThreshold: ZeroOneRange,
  },
  ocr: {
    workersNum: number,
    language: string,
  },
};

export const DETECTION_CONFIG: DetectionConfig = {
  modelLoading: {
    linksDetectorModelURL: `${MODELS_BASE_URL}/models/links_detector/model.json`,
  },
  imagePreprocessing: {
    ui: {
      enabled: true,
      brightness: 0.2,
      contrast: 0.2,
    },
    model: {
      enabled: true,
      brightness: 0.65,
      contrast: 0.85,
    },
  },
  videoStreaming: {
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
    workersNum: 3,
    language: 'eng',
  },
};
