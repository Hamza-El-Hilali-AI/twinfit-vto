export function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image could not be loaded."));
    image.src = src;
  });
}

export async function removeLightBackground(src: string, tolerance = 48): Promise<string> {
  const image = await loadImage(src);
  const canvas = document.createElement("canvas");
  const maxEdge = 1400;
  const ratio = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
  canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return src;
  }

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = data.data;
  const samples = [
    getPixel(pixels, canvas.width, 0, 0),
    getPixel(pixels, canvas.width, canvas.width - 1, 0),
    getPixel(pixels, canvas.width, 0, canvas.height - 1),
    getPixel(pixels, canvas.width, canvas.width - 1, canvas.height - 1),
  ];
  const bg = samples.reduce(
    (sum, sample) => ({
      r: sum.r + sample.r / samples.length,
      g: sum.g + sample.g / samples.length,
      b: sum.b + sample.b / samples.length,
    }),
    { r: 0, g: 0, b: 0 },
  );

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const distance = Math.hypot(r - bg.r, g - bg.g, b - bg.b);
    const brightness = (r + g + b) / 3;
    const likelyLightStudioBackground = brightness > 224 && Math.max(r, g, b) - Math.min(r, g, b) < 28;

    if (distance < tolerance || likelyLightStudioBackground) {
      const fade = Math.max(0, Math.min(1, distance / tolerance));
      pixels[i + 3] = Math.round(255 * fade);
    }
  }

  ctx.putImageData(data, 0, 0);
  return canvas.toDataURL("image/png");
}

function getPixel(data: Uint8ClampedArray, width: number, x: number, y: number) {
  const index = (y * width + x) * 4;
  return {
    r: data[index],
    g: data[index + 1],
    b: data[index + 2],
  };
}

export function downloadDataUrl(dataUrl: string, fileName: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
