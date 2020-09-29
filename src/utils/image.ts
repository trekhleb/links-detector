// import glfx from 'glfx';

export type Pixels = HTMLImageElement | HTMLCanvasElement| HTMLVideoElement;

export const preprocessPixels = (pixels: Pixels): Pixels => {
  const processedPixels = pixels;

  // const processedCanvas = glfx.canvas();
  // const precessedTexture = processedCanvas.texture(processedPixels);
  // processedCanvas
  //   .draw(precessedTexture)
  //   .brightnessContrast(0.2, 0.2)
  //   .hueSaturation(0, -1)
  //   .update();
  // precessedTexture.destroy();

  return processedPixels;
};
