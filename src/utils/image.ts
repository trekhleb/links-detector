/* eslint-disable no-param-reassign */

export type Pixels = HTMLImageElement | HTMLCanvasElement| HTMLVideoElement;

export type FilterFunc = (colors: Uint8ClampedArray, shift: number) => void;

const cutColor = (color: number): number => {
  return Math.min(Math.floor(color), 255);
};

// contrast --> [-1, 1]
// @see: http://thecryptmag.com/Online/56/imgproc_5.html
// @see: https://css-tricks.com/manipulating-pixels-using-canvas/
export const contrastFilter = (normalizedContrast: number): FilterFunc => (
  colors: Uint8ClampedArray,
  shift: number,
): void => {
  const contrast = normalizedContrast * 100;
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  for (let channel = 0; channel < 3; channel += 1) {
    colors[shift + channel] = cutColor(factor * (colors[shift + channel] - 128) + 128);
  }
};

// brightness --> [-1, 1]
// @see: https://css-tricks.com/manipulating-pixels-using-canvas/
export const brightnessFilter = (brightness: number): FilterFunc => (
  colors: Uint8ClampedArray,
  shift: number,
): void => {
  const brightnessDelta = 255 * brightness;
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
