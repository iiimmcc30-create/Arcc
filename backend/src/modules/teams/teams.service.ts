import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../../entities';

@Injectable()
export class TeamsService {
  constructor(@InjectRepository(Team) private readonly repo: Repository<Team>) {}

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  create(data: Partial<Team>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<Team>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { ok: true };
  }
}
