import React, {CSSProperties, MutableRefObject, useEffect, useRef, useState} from 'react';

type FacingMode = 'user' | 'environment' | 'left' | 'right' ;

type CameraStreamProps = {
  width?: number,
  height?: number,
  facingMode?: FacingMode,
  frameRate?: number,
  flipHorizontal?: boolean,
};

function CameraStream(props: CameraStreamProps): React.ReactElement {
  const {
    width = 300,
    height = 300,
    frameRate = 30,
    facingMode = 'environment',
    flipHorizontal = false,
  } = props;

  const videoRef: MutableRefObject<HTMLVideoElement | null> = useRef<HTMLVideoElement | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage('Your browser does not support camera access');
      return;
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
      })

    return (): void => {
      // Stop camera access.
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [width, height, facingMode, frameRate]);

  const videoStyle: CSSProperties = {
    transform: flipHorizontal ? 'scaleX(-1)' : '',
  };

  return (
    <div>
      <video
        ref={videoRef}
        width={width}
        height={height}
        style={videoStyle}
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
