import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../../entities';

@Injectable()
export class GamesService {
  constructor(@InjectRepository(Game) private readonly repo: Repository<Game>) {}

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  create(data: Partial<Game>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<Game>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { ok: true };
  }
}
