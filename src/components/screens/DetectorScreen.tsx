import React from 'react';
import CameraStream from '../elements/CameraStream';

function DetectorScreen(): React.ReactElement {
  const onFrame = async (): Promise<void> => {
    console.log('+++++++');
    return;
  };

  return (
    <div>
      <h1 className="font-roboto text-4xl">Detector Screen</h1>
      <CameraStream onFrame={onFrame} />
    </div>
  );
}

export default DetectorScreen;
