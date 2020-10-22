import React, { CSSProperties } from 'react';
import { DetectionPerformance } from '../../hooks/useLinksDetector';

type DetectionPerformanceProps = {
  metrics: DetectionPerformance | null,
};

function PerformanceMonitor(props: DetectionPerformanceProps): React.ReactElement | null {
  const { metrics } = props;

  const monitorStyles: CSSProperties = {
    color: 'white',
    backgroundColor: 'black',
    padding: '10px',
    fontSize: '10px',
  };

  if (!metrics) {
    return null;
  }

  return (
    <div style={monitorStyles}>
      <div>
        proc: <b>{metrics.processing}</b>s
      </div>
      <div>
        https: <b>{metrics.inference}</b>s
      </div>
      <div>
        ocr: <b>{metrics.ocr}</b>s
      </div>
      <div>
        total: <b>{metrics.total}</b>s
      </div>
      <div>
        <b>{metrics.fps}</b>fps
      </div>
    </div>
  );
}

export default PerformanceMonitor;
