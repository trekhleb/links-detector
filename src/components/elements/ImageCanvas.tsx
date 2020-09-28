import React, { useEffect, useRef } from 'react';

type ImageCanvasProps = {
  width: number,
  height: number,
};

function ImageCanvas(props: ImageCanvasProps): React.ReactElement {
  const { width, height } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
  }, []);

  return (
    <canvas
      width={width}
      height={height}
      ref={canvasRef}
    />
  );
}

export default ImageCanvas;
