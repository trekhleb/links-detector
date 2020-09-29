import React, { useEffect, useRef } from 'react';
import useLogger from '../../hooks/useLogger';
import { Pixels } from '../../utils/image';

type PixelsCanvasProps = {
  pixels: Pixels | null,
  width: number,
  height: number,
};

function PixelsCanvas(props: PixelsCanvasProps): React.ReactElement {
  const { width, height, pixels } = props;

  const logger = useLogger({ context: 'ImageCanvas' });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !pixels) {
      return;
    }
    const ctx: CanvasRenderingContext2D | null = canvasRef.current.getContext('2d');
    if (!ctx) {
      return;
    }
    logger.logDebug('useEffect');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(pixels, 0, 0);
  }, [pixels, width, height, logger]);

  return (
    <canvas
      width={width}
      height={height}
      ref={canvasRef}
    />
  );
}

export default PixelsCanvas;
