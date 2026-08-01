import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../../entities';

@Injectable()
export class TournamentsService {
  constructor(@InjectRepository(Tournament) private readonly repo: Repository<Tournament>) {}

  findAll(status?: string) {
    if (status) {
      return this.repo.find({ where: { status: status as any }, order: { startDate: 'DESC' } });
    }
    return this.repo.find({ order: { startDate: 'DESC' } });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  create(data: Partial<Tournament>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<Tournament>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { ok: true };
  }
}
