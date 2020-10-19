import React, { useEffect, useState } from 'react';

import {
  getTFInfo,
  isCanvasFilterSupported,
  isWebGLSupported,
  TFInfo,
} from '../../utils/debug';
import useLogger from '../../hooks/useLogger';
import { DETECTION_CONFIG } from '../../configs/detectionConfig';

function DebugInfo(): React.ReactElement {
  const [tfInfo, setTfInfo] = useState<TFInfo | null>(null);
  const logger = useLogger({ context: 'DebugInfo' });

  useEffect(() => {
    logger.logDebug('useEffect');
    getTFInfo({
      modelURL: DETECTION_CONFIG.modelLoading.linksDetectorModelURL,
    }).then((info: TFInfo) => {
      setTfInfo(info);
      logger.logDebug('useEffect: then', { info });
    });
  }, [logger]);

  if (!tfInfo) {
    return <div>Loading...</div>;
  }

  const supported = 'YES';
  const notSupported = 'NO';

  return (
    <ul>
      <li>
        Platform name: <code>{tfInfo.platformName}</code>
      </li>
      <li>
        Backend name: <code>{tfInfo.backendName}</code>
      </li>
      <li>
        WebGL: <code>{isWebGLSupported() ? supported : notSupported}</code>
      </li>
      <li>
        Canvas Filters: <code>{isCanvasFilterSupported() ? supported : notSupported}</code>
      </li>
    </ul>
  );
}

export default DebugInfo;
