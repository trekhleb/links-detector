import React from 'react';
import CameraStream from '../shared/CameraStream';

function LiveDetector(): React.ReactElement {
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
