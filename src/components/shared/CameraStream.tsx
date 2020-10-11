import React, {
  CSSProperties,
  useCallback, useEffect, useRef, useState,
} from 'react';
import throttle from 'lodash/throttle';

import useLogger from '../../hooks/useLogger';
import Notification, { NotificationLevel } from './Notification';

type FacingMode = 'user' | 'environment';

type CameraStreamProps = {
  width: number,
  height: number,
  idealFrameRate: number,
  onFrame: (video: HTMLVideoElement) => Promise<void>,
  facingMode?: FacingMode,
  videoStyle?: CSSProperties,
};

const videoFrameRate = 30;
const oneSecond = 1000;

/* global MediaStreamConstraints */
function CameraStream(props: CameraStreamProps): React.ReactElement {
  const {
    width,
    height,
    onFrame,
    idealFrameRate,
    facingMode = 'environment',
    videoStyle: videoStyleOverrides = {},
  } = props;

  const frameThrottlingMs = Math.floor(oneSecond / idealFrameRate);

  const logger = useLogger({ context: 'CameraStream' });

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // On iOS Safari filters add weird 1px left and bottom white borders to the video.
  // To hide that border the -1px shift is introduced in the styles below.
  const VIDEO_PADDING = 2;

  const videoWidth = width + 2 * VIDEO_PADDING;
  const videoHeight = height + 2 * VIDEO_PADDING;

  const onLocalFrame = (): void => {
    requestAnimationFrame(() => {
      logger.logDebug('onLocalFrame');
      if (videoRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        onFrame(videoRef.current).then(throttledOnLocalFrame);
      }
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledOnLocalFrameCallback = useCallback(throttledOnLocalFrame, []);

  useEffect((): () => void => {
    if (!videoRef.current) {
      return (): void => {
      };
    }

    logger.logDebug('useEffect');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const msg = 'Your browser does not support camera access';
      setErrorMessage(msg);
      logger.logWarn(msg);
      return (): void => {
      };
    }

    let localStream: MediaStream | null = null;

    const userMediaConstraints: MediaStreamConstraints = {
      audio: false,
      video: {
        width: { ideal: videoWidth },
        height: { ideal: videoHeight },
        facingMode: { ideal: facingMode },
        frameRate: { ideal: videoFrameRate },
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
        logger.logError(message, error);
      });

    return (): void => {
      logger.logDebug('useEffect return');
      // Stop animation frames.
      throttledOnLocalFrameCallback.cancel();
      // Stop camera access.
      if (localStream) {
        logger.logDebug('useEffect return: Stopping the camera access');
        localStream.getTracks().forEach((track: MediaStreamTrack) => {
          track.stop();
        });
      }
    };
  }, [videoWidth, videoHeight, facingMode, logger, throttledOnLocalFrameCallback]);

  if (errorMessage) {
    return (
      <Notification level={NotificationLevel.DANGER}>
        {errorMessage}
      </Notification>
    );
  }

  const videoWrapperStyle: CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    overflow: 'hidden',
  };

  const videoStyle: CSSProperties = {
    objectFit: 'cover',
    width: `${videoWidth}px`,
    minWidth: `${videoWidth}px`,
    height: `${videoHeight}px`,
    minHeight: `${videoHeight}px`,
    marginLeft: `-${VIDEO_PADDING}px`,
    ...videoStyleOverrides,
  };

  return (
    <div style={videoWrapperStyle}>
      <video
        ref={videoRef}
        width={videoWidth}
        height={videoHeight}
        style={videoStyle}
        className="fade-in-1"
        playsInline
        autoPlay
        muted
      >
        Your browser does not support embedded videos
      </video>
    </div>
  );
}

export default CameraStream;
