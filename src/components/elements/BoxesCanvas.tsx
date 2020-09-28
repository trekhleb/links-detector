import React, { useRef, useEffect, useCallback } from 'react';
import { DetectionBox } from '../../utils/graphModelExecute';
import useLogger from '../../hooks/useLogger';

type BoxesCanvasProps = {
  boxes: DetectionBox[],
  canvasWidth: number,
  canvasHeight: number,
  normalized?: boolean,
};

const boxColor = '#2fff00';
const boxFrameWidth = 1;
const boxLabelFont = '10px helvetica';
const boxLabelColor = '#000000';
const boxLabelPadding = 4;

const BoxesCanvas = (props: BoxesCanvasProps): React.ReactElement => {
  const {
    boxes,
    canvasWidth,
    canvasHeight,
    normalized = true,
  } = props;

  const logger = useLogger({ context: 'DetectionBoxes' });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawDetections = (): void => {
    if (!canvasRef.current || !boxes) {
      return;
    }

    const ctx: CanvasRenderingContext2D | null = canvasRef.current.getContext('2d');
    if (!ctx) {
      logger.logError('cannot get canvas 2D context');
      return;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = boxLabelFont;
    ctx.textBaseline = 'top';

    let normalizedBoxes: DetectionBox[] = [...boxes];

    if (normalized) {
      normalizedBoxes = normalizedBoxes.map((box: DetectionBox) => {
        const {
          x1,
          y1,
          x2,
          y2,
          categoryId,
          score,
        } = box;

        const normalizeByWidth = (w: number): number => Math.floor(canvasWidth * w);
        const normalizeByHeight = (h: number): number => Math.floor(canvasHeight * h);

        return {
          x1: normalizeByWidth(x1),
          y1: normalizeByHeight(y1),
          x2: normalizeByWidth(x2),
          y2: normalizeByHeight(y2),
          categoryId,
          score,
        };
      });
    }

    logger.logDebug('drawDetections', {
      boxes,
      normalizedBoxes,
    });

    normalizedBoxes.forEach((box: DetectionBox) => {
      const {
        x1,
        y1,
        x2,
        y2,
        score,
      } = box;

      // Draw the bounding box.
      ctx.strokeStyle = boxColor;
      ctx.lineWidth = boxFrameWidth;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

      // Draw the label background.
      ctx.fillStyle = boxColor;
      const label = `${Math.floor(score * 100)}%`;
      const textWidth = ctx.measureText(label).width;
      const textHeight = parseInt(boxLabelFont, 10);

      // Draw top left rectangle.
      ctx.fillRect(
        x1 - boxFrameWidth,
        y1 - textHeight - boxLabelPadding,
        textWidth + boxLabelPadding,
        textHeight + boxLabelPadding,
      );

      // Draw the text last to ensure it's on top.
      ctx.fillStyle = boxLabelColor;
      ctx.fillText(
        label,
        x1 + boxLabelPadding / 2 - boxFrameWidth,
        y1 - boxLabelPadding / 2 - textHeight,
      );
    });
  };

  const drawDetectionsCallback = useCallback(drawDetections, [
    boxes,
    normalized,
    canvasHeight,
    canvasWidth,
    logger,
  ]);

  useEffect(() => {
    drawDetectionsCallback();
  }, [drawDetectionsCallback]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
    />
  );
};

export default BoxesCanvas;
