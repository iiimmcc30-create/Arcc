import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from '../../entities';

@Injectable()
export class NewsService {
  constructor(@InjectRepository(News) private readonly repo: Repository<News>) {}

  findAll() {
    return this.repo.find({ order: { date: 'DESC' } });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  create(data: Partial<News>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<News>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { ok: true };
  }
}
