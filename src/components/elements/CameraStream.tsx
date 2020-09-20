import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import useLogger, {Logger} from '../hooks/useLogger';

type FacingMode = 'user' | 'environment' | 'left' | 'right' ;

type CameraStreamProps = {
  width?: number,
  height?: number,
  facingMode?: FacingMode,
  frameRate?: number,
};

function CameraStream(props: CameraStreamProps): React.ReactElement {
  const {
    width = 300,
    height = 300,
    frameRate = 30,
    facingMode = 'environment',
  } = props;

  const logger: Logger = useLogger();

  const videoRef: MutableRefObject<HTMLVideoElement | null> = useRef<HTMLVideoElement | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect((): () => void => {
    if (!videoRef.current) {
      return (): void => {};
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const msg = 'Your browser does not support camera access';
      setErrorMessage('Your browser does not support camera access');
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
        frameRate: {ideal: frameRate},
      },
    };

    navigator.mediaDevices.getUserMedia(userMediaConstraints)
      .then((stream: MediaStream) => {
        localStream = stream;
        if (!videoRef.current) {
          return;
        }
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = (e: Event): any | null => {
        };
      })
      .catch((e: Error) => {
        let message = 'Video cannot be started';
        if (e && e.message) {
          message += `: ${e.message}`;
        }
        setErrorMessage(message);
        logger.logError(message)
      })

    return (): void => {
      // Stop camera access.
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [width, height, facingMode, frameRate, logger]);

  return (
    <div>
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
      <div>
        Error: {errorMessage}
      </div>
    </div>
  );
}

export default CameraStream;
