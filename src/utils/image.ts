type Pixels = ImageData| HTMLImageElement | HTMLCanvasElement| HTMLVideoElement;

export const preprocessPixels = (pixels: Pixels): Pixels => {
  return pixels;
};
