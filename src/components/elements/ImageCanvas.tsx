import React, { useEffect, useRef } from 'react';
import useLogger from '../../hooks/useLogger';

export type CanvasImageSource = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement;

type ImageCanvasProps = {
  width: number,
  height: number,
  imageSrc: CanvasImageSource | null,
};

function ImageCanvas(props: ImageCanvasProps): React.ReactElement {
  const { width, height, imageSrc } = props;

  const logger = useLogger({ context: 'ImageCanvas' });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !imageSrc) {
      return;
    }
    const ctx: CanvasRenderingContext2D | null = canvasRef.current.getContext('2d');
    if (!ctx) {
      return;
    }
    logger.logDebug('useEffect');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(imageSrc, 0, 0);
  }, [imageSrc, width, height, logger]);

  return (
    <canvas
      width={width}
      height={height}
      ref={canvasRef}
    />
  );
}

export default ImageCanvas;
