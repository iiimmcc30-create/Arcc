import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { Repository } from 'typeorm';
import { Upload } from '../../entities/upload.entity';
import { getUploadDir, UPLOAD_PUBLIC_PREFIX } from '../../uploads/upload-path';

@Injectable()
export class UploadsService {
  constructor(@InjectRepository(Upload) private readonly repo: Repository<Upload>) {}

  async createFromFile(
    file: Express.Multer.File,
    uploadedBy?: string | null,
  ): Promise<Upload> {
    const record = this.repo.create({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: `${UPLOAD_PUBLIC_PREFIX}/${file.filename}`,
      uploadedBy: uploadedBy || null,
    });
    return this.repo.save(record);
  }

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Upload not found');
    return item;
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    const fullPath = join(getUploadDir(), item.filename);
    if (existsSync(fullPath)) {
      try {
        unlinkSync(fullPath);
      } catch {
        // ignore FS errors; still remove DB row
      }
    }
    await this.repo.delete(id);
    return { ok: true };
  }
}
