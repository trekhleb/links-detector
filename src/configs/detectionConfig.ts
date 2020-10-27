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
      size: number, // Size in pixels (0 means do not resize).
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
    useRegionProposals: boolean,
    workersNum: number,
    language: string,
    regionProposalPadding: ZeroOneRange,
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
      brightness: 0.6,
      contrast: 0.7,
      size: 600,
    },
  },
  videoStreaming: {
    idealFPS: 10,
  },
  httpsDetection: {
    // @see: https://js.tensorflow.org/api/latest/#image.nonMaxSuppressionAsync
    maxBoxesNum: 3,
    IOUThreshold: 0.5,
    scoreThreshold: 0.5,
  },
  ocr: {
    // @see: https://github.com/naptha/tesseract.js/blob/master/docs/examples.md
    useRegionProposals: true,
    workersNum: 3,
    language: 'eng',
    regionProposalPadding: 0.03,
  },
};
