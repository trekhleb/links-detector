import React from 'react';

import CameraStream from '../shared/CameraStream';
import useWindowSize from '../../hooks/useWindowSize';
import useGraphModel from '../../hooks/useGraphModel';
import { LINKS_DETECTOR_MODEL_URL } from '../../constants/models';

function LiveDetector(): React.ReactElement | null {
  const windowSize = useWindowSize();
  const { model, error: modelError } = useGraphModel({
    modelURL: LINKS_DETECTOR_MODEL_URL,
    warmup: false,
  });

  if (!model || modelError) {
    return null;
  }

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
