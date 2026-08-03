import { api } from '@/lib/api';

/**
 * Upload an image to the Nest media storage service.
 * Returns a public URL path such as `/uploads/....jpg`.
 */
export async function uploadImageFile(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error('Image must be under 8MB');
  }
  const saved = await api.uploadFile(file);
  if (!saved?.url) throw new Error('Upload response missing url');
  return saved.url;
}
