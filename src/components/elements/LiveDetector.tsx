import React from 'react';

import CameraStream from '../shared/CameraStream';
import useWindowSize from '../hooks/useWindowSize';

function LiveDetector(): React.ReactElement | null {
  const windowSize = useWindowSize();

  if (!windowSize || !windowSize.width || !windowSize.height) {
    return null;
  }

  const onFrame = async (): Promise<void> => {
    return;
  };

  return (
    <div>
      <CameraStream
        onFrame={onFrame}
        width={windowSize.width}
        height={windowSize.height}
      />
    </div>
  );
}

export default LiveDetector;
