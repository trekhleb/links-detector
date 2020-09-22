import React, {useCallback, useEffect, useRef, useState} from 'react';
import throttle from 'lodash/throttle';

import useLogger from '../hooks/useLogger';
import Notification from './Notification';

type FacingMode = 'user' | 'environment';

type CameraStreamProps = {
  width?: number,
  height?: number,
  facingMode?: FacingMode,
  idealFrameRate?: number,
  onFrame?: () => Promise<void>,
};

const videoFrameRate = 30;
const oneSecond = 1000;

/* global MediaStreamConstraints */
function CameraStream(props: CameraStreamProps): React.ReactElement {
  const {
    width = 300,
    height = 300,
    idealFrameRate = 1,
    facingMode = 'environment',
    onFrame = (): Promise<void> => Promise.resolve(),
  } = props;

  const frameThrottlingMs = Math.floor(oneSecond / idealFrameRate);

  const logger = useLogger({context: 'CameraStream'});

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>('Blah');

  const onLocalFrame = (): void => {
    requestAnimationFrame(() => {
      logger.logDebug('onLocalFrame');
      onFrame().then(throttledOnLocalFrame);
    });
  };

  const throttledOnLocalFrame = throttle(
    onLocalFrame,
    frameThrottlingMs,
    {
      leading: false,
      trailing: true,
    },
  );

  const throttledOnLocalFrameCallback = useCallback(throttledOnLocalFrame, []);

  useEffect((): () => void => {
    if (!videoRef.current) {
      return (): void => {};
    }

    logger.logDebug('useEffect');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const msg = 'Your browser does not support camera access';
      setErrorMessage(msg);
      logger.logWarn(msg);
      return (): void => {};
    }

    let localStream: MediaStream | null = null;

    const userMediaConstraints: MediaStreamConstraints = {
      audio: false,
      video: {
        width: {ideal: width},
        height: {ideal: height},
        facingMode: {ideal: facingMode},
        frameRate: {ideal: videoFrameRate},
      },
    };

    // @see: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    navigator.mediaDevices.getUserMedia(userMediaConstraints)
      .then((stream: MediaStream) => {
        localStream = stream;
        if (!videoRef.current) {
          return;
        }
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = (): void => {
          logger.logDebug('onloadedmetadata');
          requestAnimationFrame(throttledOnLocalFrameCallback);
        };
      })
      .catch((error: DOMException) => {
        let message = 'Video cannot be started';
        if (error && error.message) {
          message += `: ${error.message}`;
        }
        setErrorMessage(message);
        logger.logError(message, error)
      })

    return (): void => {
      logger.logDebug('useEffect return');
      // Stop camera access.
      if (localStream) {
        logger.logDebug('useEffect return: Stopping the camera access');
        localStream.getTracks().forEach((track: MediaStreamTrack) => {
          track.stop();
        });
      }
    };
  }, [width, height, facingMode, logger, throttledOnLocalFrameCallback]);

  if (errorMessage) {
    return (
      <Notification>
        {errorMessage}
      </Notification>
    );
  }

  return (
    <video
      ref={videoRef}
      width={width}
      height={height}
      playsInline
      autoPlay
      muted
    >
      Your browser does not support embedded videos
    </video>
  );
}

export default CameraStream;
