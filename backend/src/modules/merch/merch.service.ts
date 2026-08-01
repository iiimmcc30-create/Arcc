import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MerchItem } from '../../entities/merch.entity';

@Injectable()
export class MerchService {
  constructor(@InjectRepository(MerchItem) private readonly repo: Repository<MerchItem>) {}

  findAll(category?: string) {
    if (category) {
      return this.repo.find({
        where: { category: category as any, available: true },
        order: { sortOrder: 'ASC', id: 'ASC' },
      });
    }
    return this.repo.find({
      where: { available: true },
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
  }

  findAllAdmin() {
    return this.repo.find({ order: { sortOrder: 'ASC', id: 'ASC' } });
  }

  create(data: Partial<MerchItem>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<MerchItem>) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { ok: true };
  }
}
