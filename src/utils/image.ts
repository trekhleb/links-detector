/* eslint-disable no-param-reassign */

export type FilterFunc = (colors: Uint8ClampedArray, shift: number) => void;

export type Pixels = HTMLImageElement | HTMLCanvasElement| HTMLVideoElement;

export const brightnessFilter = (brightness: number): FilterFunc => (
  colors: Uint8ClampedArray,
  shift: number,
): void => {
  const brightnessDelta = 255 * brightness;

  const r = Math.min(
    Math.floor(colors[shift] + brightnessDelta),
    255,
  );

  const g = Math.min(
    Math.floor(colors[shift + 1] + brightnessDelta),
    255,
  );

  const b = Math.min(
    Math.floor(colors[shift + 2] + brightnessDelta),
    255,
  );

  colors[shift] = r;
  colors[shift + 1] = g;
  colors[shift + 2] = b;
};

export const greyscaleFilter = (): FilterFunc => (
  colors: Uint8ClampedArray,
  shift: number,
): void => {
  const average = Math.min(
    Math.floor((0.3 * colors[shift] + 0.59 * colors[shift + 1] + 0.11 * colors[shift + 2])),
    255,
  );
  colors[shift] = average;
  colors[shift + 1] = average;
  colors[shift + 2] = average;
};

export const preprocessPixels = (pixels: Pixels, filters: FilterFunc[]): Pixels => {
  const canvas: HTMLCanvasElement = document.createElement<'canvas'>('canvas');

  canvas.width = pixels.width;
  canvas.height = pixels.height;

  const context: CanvasRenderingContext2D | null = canvas.getContext('2d');

  if (context) {
    context.drawImage(pixels, 0, 0);

    const imageData: ImageData = context.getImageData(0, 0, canvas.width, canvas.height);

    const COLORS_IN_PIXEL = 4; // RGBA
    for (let shift = 0; shift < imageData.data.length; shift += COLORS_IN_PIXEL) {
      filters.forEach((filter: FilterFunc) => {
        filter(imageData.data, shift);
      });
    }

    context.putImageData(imageData, 0, 0);

    return canvas;
  }

  return pixels;
};
