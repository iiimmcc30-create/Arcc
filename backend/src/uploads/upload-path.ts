import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

/** Absolute directory used for persisted media files. */
export function getUploadDir(): string {
  const fromEnv = process.env.UPLOAD_DIR?.trim();
  if (fromEnv) {
    mkdirSync(fromEnv, { recursive: true });
    return fromEnv;
  }
  // Prefer /data/uploads when a Railway volume is mounted at /data
  const volumePath = '/data/uploads';
  if (existsSync('/data')) {
    mkdirSync(volumePath, { recursive: true });
    return volumePath;
  }
  const local = join(process.cwd(), 'uploads');
  mkdirSync(local, { recursive: true });
  return local;
}

export const UPLOAD_PUBLIC_PREFIX = '/uploads';
