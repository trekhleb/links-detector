import React, { CSSProperties, useState } from 'react';
import { Rectangle } from 'tesseract.js';

import CameraStream from '../shared/CameraStream';
import useWindowSize from '../../hooks/useWindowSize';
import { DETECTION_CONFIG } from '../../configs/detectionConfig';
import Notification, { NotificationLevel } from '../shared/Notification';
import useLogger from '../../hooks/useLogger';
import ProgressBar from '../shared/ProgressBar';
import BoxesCanvas from './BoxesCanvas';
import { isDebugMode } from '../../constants/debug';
import ErrorBoundary from '../shared/ErrorBoundary';
import PixelsCanvas from './PixelsCanvas';
import useLinksDetector, { DetectionPerformance } from '../../hooks/useLinksDetector';
import { normalizeCSSFilterParam } from '../../utils/image';
import PerformanceMonitor from './PerformanceMonitor';
import { DetectionBox } from '../../utils/graphModel';
import DetectedLinks from './DetectedLinks';

const uiVideoBrightness = normalizeCSSFilterParam(
  DETECTION_CONFIG.imagePreprocessing.ui.brightness,
);

const uiVideoContrast = normalizeCSSFilterParam(
  DETECTION_CONFIG.imagePreprocessing.ui.contrast,
);

const videoStyle: CSSProperties = DETECTION_CONFIG.imagePreprocessing.ui.enabled ? {
  filter: `brightness(${uiVideoBrightness}) contrast(${uiVideoContrast}) grayscale(1)`,
} : {};

function LinksDetector(): React.ReactElement | null {
  const logger = useLogger({ context: 'LiveDetector' });
  const windowSize = useWindowSize();

  const [
    detectionPerformance,
    setDetectionPerformance,
  ] = useState<DetectionPerformance | null>(null);

  const {
    detectedLinks,
    detectLinks,
    error,
    loadingProgress,
    loadingStage,
    httpsBoxes,
    regionProposals,
    pixels,
  } = useLinksDetector({
    modelURL: DETECTION_CONFIG.modelLoading.linksDetectorModelURL,
    maxBoxesNum: DETECTION_CONFIG.httpsDetection.maxBoxesNum,
    scoreThreshold: DETECTION_CONFIG.httpsDetection.scoreThreshold,
    iouThreshold: DETECTION_CONFIG.httpsDetection.IOUThreshold,
    workersNum: DETECTION_CONFIG.ocr.workersNum,
    language: DETECTION_CONFIG.ocr.language,
  });

  const isDebug: boolean = isDebugMode();

  if (error) {
    return (
      <Notification level={NotificationLevel.DANGER}>
        {error}
      </Notification>
    );
  }

  if (loadingProgress === null || loadingProgress < 1) {
    return <ProgressBar progress={loadingProgress} text={loadingStage} />;
  }

  if (!windowSize || !windowSize.width || !windowSize.height) {
    return <ProgressBar text="Detecting the window size" />;
  }

  const onFrame = async (video: HTMLVideoElement): Promise<void> => {
    const resizeToSize: number = Math.min(
      video.width,
      DETECTION_CONFIG.imagePreprocessing.model.size,
    );
    logger.logDebug('onFrame start', { resizeToSize });
    const currentDetectionPerformance: DetectionPerformance | null = await detectLinks({
      video,
      applyFilters: DETECTION_CONFIG.imagePreprocessing.model.enabled,
      videoBrightness: DETECTION_CONFIG.imagePreprocessing.model.brightness,
      videoContrast: DETECTION_CONFIG.imagePreprocessing.model.contrast,
      regionProposalsPadding: DETECTION_CONFIG.ocr.regionProposalPadding,
      useRegionProposals: DETECTION_CONFIG.ocr.useRegionProposals,
      resizeToSize,
    });
    if (isDebug) {
      setDetectionPerformance(currentDetectionPerformance);
    }
    logger.logDebug('onFrame end');
  };

  const videoSize: number = Math.min(windowSize.width, windowSize.height);

  const canvasContainerStyles: CSSProperties = {
    marginTop: `-${videoSize}px`,
    position: 'absolute',
  };

  const detectedLinksContainerStyles: CSSProperties = {
    marginTop: `-${videoSize}px`,
    width: `${videoSize}px`,
    height: `${videoSize}px`,
    position: 'absolute',
    overflow: 'hidden',
  };

  const performanceMonitorStyles: CSSProperties = {
    position: 'absolute',
    left: 0,
    bottom: 0,
  };

  const httpsBoxesCanvas = httpsBoxes && isDebug ? (
    <ErrorBoundary>
      <div style={canvasContainerStyles}>
        <BoxesCanvas
          boxes={httpsBoxes}
          width={videoSize}
          height={videoSize}
          boxColor="#00ff00"
          normalized
        />
      </div>
    </ErrorBoundary>
  ) : null;

  const regionProposalBoxes: DetectionBox[] = regionProposals && regionProposals.length
    ? regionProposals.map((regionProposal: Rectangle): DetectionBox => {
      return {
        x1: regionProposal.left,
        x2: regionProposal.left + regionProposal.width,
        y1: regionProposal.top,
        y2: regionProposal.top + regionProposal.height,
        score: 0,
        categoryId: 0,
      };
    })
    : [];

  const regionProposalsCanvas = regionProposalBoxes && regionProposalBoxes.length && isDebug ? (
    <ErrorBoundary>
      <div style={canvasContainerStyles}>
        <BoxesCanvas
          boxes={regionProposalBoxes}
          width={videoSize}
          height={videoSize}
          boxColor="#0000ff"
          normalized={false}
        />
      </div>
    </ErrorBoundary>
  ) : null;

  const imageCanvas = isDebug ? (
    <ErrorBoundary>
      <div style={canvasContainerStyles}>
        <PixelsCanvas
          pixels={pixels}
          width={videoSize}
          height={videoSize}
        />
      </div>
    </ErrorBoundary>
  ) : null;

  const detectedLinksCanvas = detectedLinks && detectedLinks.length ? (
    <ErrorBoundary>
      <div style={detectedLinksContainerStyles}>
        <DetectedLinks links={detectedLinks} containerSize={videoSize} />
      </div>
    </ErrorBoundary>
  ) : null;

  const performanceMonitor = isDebug ? (
    <ErrorBoundary>
      <div style={performanceMonitorStyles}>
        <PerformanceMonitor metrics={detectionPerformance} />
      </div>
    </ErrorBoundary>
  ) : null;

  return (
    <div>
      <ErrorBoundary>
        <CameraStream
          onFrame={onFrame}
          width={videoSize}
          height={videoSize}
          videoStyle={videoStyle}
          idealFrameRate={DETECTION_CONFIG.videoStreaming.idealFPS}
        />
      </ErrorBoundary>
      { imageCanvas }
      { regionProposalsCanvas }
      { httpsBoxesCanvas }
      { performanceMonitor }
      { detectedLinksCanvas }
    </div>
  );
}

export default LinksDetector;
