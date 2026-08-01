import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from '../../entities';

@Injectable()
export class PartnersService {
  constructor(@InjectRepository(Partner) private readonly repo: Repository<Partner>) {}

  findAll() {
    return this.repo.find({ order: { sortOrder: 'ASC', id: 'ASC' } });
  }

  create(data: Partial<Partner>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<Partner>) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { ok: true };
  }
}
