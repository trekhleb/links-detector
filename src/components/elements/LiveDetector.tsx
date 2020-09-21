import React from 'react';

import CameraStream from '../shared/CameraStream';
import useWindowSize from '../hooks/useWindowSize';

function LiveDetector(): React.ReactElement {
  const windowSize = useWindowSize();

  const onFrame = async (): Promise<void> => {
    console.log('+++++++');
    return;
  };

  return (
    <div>
      <CameraStream onFrame={onFrame} />
    </div>
  );
}

export default LiveDetector;
