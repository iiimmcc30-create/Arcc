import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../../entities';

@Injectable()
export class PlayersService {
  constructor(@InjectRepository(Player) private readonly repo: Repository<Player>) {}

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  create(data: Partial<Player>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<Player>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { ok: true };
  }
}
