import React, {useEffect, useRef, useState} from 'react';
import useLogger, {Logger} from '../hooks/useLogger';

type FacingMode = 'user' | 'environment' | 'left' | 'right' ;

type CameraStreamProps = {
  width?: number,
  height?: number,
  facingMode?: FacingMode,
  frameRate?: number,
  onFrame?: () => Promise<void>,
};

function CameraStream(props: CameraStreamProps): React.ReactElement {
  const {
    width = 300,
    height = 300,
    frameRate = 30,
    facingMode = 'environment',
    onFrame = (): Promise<void> => Promise.resolve(),
  } = props;

  const loggerContext: string = 'CameraStream';

  const logger: Logger = useLogger();

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect((): () => void => {
    if (!videoRef.current) {
      return (): void => {};
    }

    logger.logDebug('useEffect', loggerContext);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const msg = 'Your browser does not support camera access';
      setErrorMessage(msg);
      logger.logWarn(msg, loggerContext);
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

    // @see: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    navigator.mediaDevices.getUserMedia(userMediaConstraints)
      .then((stream: MediaStream) => {
        localStream = stream;
        if (!videoRef.current) {
          return;
        }
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = (event: Event): any | null => {
          logger.logDebug('onloadedmetadata', loggerContext)
        };
      })
      .catch((error: DOMException) => {
        let message = 'Video cannot be started';
        if (error && error.message) {
          message += `: ${error.message}`;
        }
        setErrorMessage(message);
        logger.logError(message, null, error)
      })

    return (): void => {
      logger.logDebug('useEffect return', loggerContext);
      if (localStream) {
        logger.logDebug('useEffect return: Stopping the camera access', loggerContext);
        localStream.getTracks().forEach((track: MediaStreamTrack) => {
          track.stop();
        });
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
