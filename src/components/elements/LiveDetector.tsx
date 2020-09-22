import React from 'react';

import CameraStream from '../shared/CameraStream';
import useWindowSize from '../hooks/useWindowSize';

function LiveDetector(): React.ReactElement | null {
  const windowSize = useWindowSize();

  if (!windowSize || !windowSize.width || !windowSize.height) {
    return null;
  }

  const videoSize: number = Math.min(windowSize.width, windowSize.height);

  const onFrame = async (): Promise<void> => undefined;

  return (
    <div>
      <CameraStream
        onFrame={onFrame}
        width={videoSize}
        height={videoSize}
      />
    </div>
  );
}

export default LiveDetector;
