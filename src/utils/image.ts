/* eslint-disable no-param-reassign */

import { SignedZeroOneRange, ZeroOneRange } from './types';

export type Pixels = HTMLImageElement | HTMLCanvasElement| HTMLVideoElement;

export type FilterFunc = (colors: Uint8ClampedArray, shift: number) => void;

const cutColor = (color: number): number => {
  return Math.min(Math.floor(color), 255);
};

// Converts [0, 1] range to [-1, 1] range.
const normalizeFilterParam = (zeroOneRange: ZeroOneRange): SignedZeroOneRange => {
  return zeroOneRange * 2 - 1;
};

// @see: https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function
export const normalizeCSSFilterParam = (zeroOneRange: ZeroOneRange): number => {
  return 1 + zeroOneRange;
};

// @see: http://thecryptmag.com/Online/56/imgproc_5.html
// @see: https://css-tricks.com/manipulating-pixels-using-canvas/
export const contrastFilter = (contrastRange: ZeroOneRange): FilterFunc => (
  colors: Uint8ClampedArray,
  shift: number,
): void => {
  const contrast = normalizeFilterParam(contrastRange) * 100;
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  for (let channel = 0; channel < 3; channel += 1) {
    colors[shift + channel] = cutColor(factor * (colors[shift + channel] - 128) + 128);
  }
};

// @see: https://css-tricks.com/manipulating-pixels-using-canvas/
export const brightnessFilter = (brightness: ZeroOneRange): FilterFunc => (
  colors: Uint8ClampedArray,
  shift: number,
): void => {
  const brightnessDelta = 255 * normalizeFilterParam(brightness);
  for (let channel = 0; channel < 3; channel += 1) {
    colors[shift + channel] = cutColor(colors[shift + channel] + brightnessDelta);
  }
};

// @see: https://www.tutorialspoint.com/dip/grayscale_to_rgb_conversion.htm
export const greyscaleFilter = (): FilterFunc => (
  colors: Uint8ClampedArray,
  shift: number,
): void => {
  const average = cutColor(
    0.3 * colors[shift] + 0.59 * colors[shift + 1] + 0.11 * colors[shift + 2],
  );
  for (let channel = 0; channel < 3; channel += 1) {
    colors[shift + channel] = average;
  }
};

export const canvasFromPixels = (
  pixels: Pixels,
  size?: number | null,
): HTMLCanvasElement | null => {
  const canvas: HTMLCanvasElement = document.createElement<'canvas'>('canvas');
  canvas.width = size || pixels.width;
  canvas.height = size || pixels.height;

  const context: CanvasRenderingContext2D | null = canvas.getContext('2d');

  if (!context) {
    return null;
  }

  context.drawImage(pixels, 0, 0, canvas.width, canvas.height);

  return canvas;
};

export type PreprocessPixelsProps = {
  pixels: Pixels,
  filters: FilterFunc[],
  resizeToSize?: number | null,
};

export const preprocessPixels = (props: PreprocessPixelsProps): Pixels => {
  const { pixels, filters, resizeToSize } = props;

  const canvas: HTMLCanvasElement | null = canvasFromPixels(pixels, resizeToSize);

  if (!canvas) {
    throw new Error('Canvas cannot be created');
  }

  const context: CanvasRenderingContext2D | null = canvas.getContext('2d');

  if (!context) {
    throw new Error('Empty canvas context');
  }

  const imageData: ImageData = context.getImageData(0, 0, canvas.width, canvas.height);

  const COLORS_IN_PIXEL = 4; // RGBA
  for (let shift = 0; shift < imageData.data.length; shift += COLORS_IN_PIXEL) {
    filters.forEach((filter: FilterFunc) => {
      filter(imageData.data, shift);
    });
  }

  context.putImageData(imageData, 0, 0);

  return canvas;
};

export const relativeToAbsolute = (relativeCoordinate: ZeroOneRange, imageSize: number): number => {
  return Math.max(
    Math.min(
      Math.round(relativeCoordinate * imageSize),
      imageSize,
    ),
    0,
  );
};
