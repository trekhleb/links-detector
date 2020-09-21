import React from 'react';
import LiveDetector from '../elements/LiveDetector';

function DetectorScreen(): React.ReactElement {
  return (
    <div>
      <h1 className="text-4xl">Detector Screen</h1>
      <LiveDetector />
    </div>
  );
}

export default DetectorScreen;
