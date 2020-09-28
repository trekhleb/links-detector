import React, { useEffect, useState } from 'react';

import { getTFInfo, TFInfo } from '../../utils/debug';
import useLogger from '../../hooks/useLogger';
import { LINKS_DETECTOR_MODEL_URL } from '../../constants/models';

function DebugInfo(): React.ReactElement {
  const [tfInfo, setTfInfo] = useState<TFInfo | null>(null);
  const logger = useLogger({ context: 'DebugInfo' });

  useEffect(() => {
    logger.logDebug('useEffect');
    getTFInfo({ modelURL: LINKS_DETECTOR_MODEL_URL }).then((info: TFInfo) => {
      setTfInfo(info);
      logger.logDebug('useEffect: then', { info });
    });
  }, [logger]);

  if (!tfInfo) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      <li>
        <small>Platform name:</small> <code>{tfInfo.platformName}</code>
      </li>
      <li>
        <small>Backend name:</small> <code>{tfInfo.backendName}</code>
      </li>
    </ul>
  );
}

export default DebugInfo;
