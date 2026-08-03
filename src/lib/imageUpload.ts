/** Read an image file, optionally downscale, and return a data URL for storage. */
export async function fileToDataUrl(
  file: File,
  options: { maxWidth?: number; quality?: number } = {},
): Promise<string> {
  const maxWidth = options.maxWidth ?? 900;
  const quality = options.quality ?? 0.85;

  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error('Image must be under 8MB');
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    const scale = Math.min(1, maxWidth / img.width);
    const width = Math.max(1, Math.round(img.width * scale));
    const height = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    ctx.drawImage(img, 0, 0, width, height);
    // Prefer JPEG for photos; keep PNG for transparency.
    const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
    return canvas.toDataURL(mime, quality);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}
