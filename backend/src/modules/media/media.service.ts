import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '../../entities';

@Injectable()
export class MediaService {
  constructor(@InjectRepository(Media) private readonly repo: Repository<Media>) {}

  findAll(category?: string) {
    if (category) {
      return this.repo.find({ where: { category: category as any }, order: { createdAt: 'DESC' } });
    }
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  create(data: Partial<Media>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<Media>) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { ok: true };
  }
}
