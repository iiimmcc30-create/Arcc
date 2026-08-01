import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus, ApplicationType } from '../../entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application) private readonly repo: Repository<Application>,
  ) {}

  create(dto: CreateApplicationDto) {
    const app = this.repo.create({
      ...dto,
      status: 'pending',
      platforms: dto.platforms || {},
      social: dto.social || {},
    });
    return this.repo.save(app);
  }

  findAll(type?: ApplicationType) {
    if (type) {
      return this.repo.find({ where: { type }, order: { createdAt: 'DESC' } });
    }
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const app = await this.repo.findOne({ where: { id } });
    if (!app) throw new NotFoundException('Application not found');
    return app;
  }

  async updateStatus(id: number, status: ApplicationStatus, adminNotes?: string) {
    const app = await this.findOne(id);
    app.status = status;
    if (adminNotes !== undefined) app.adminNotes = adminNotes;
    return this.repo.save(app);
  }

  async update(id: number, data: Partial<Application>) {
    await this.findOne(id);
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { ok: true };
  }

  async stats() {
    const all = await this.repo.find();
    return {
      total: all.length,
      pending: all.filter((a) => a.status === 'pending').length,
      approved: all.filter((a) => a.status === 'approved').length,
      rejected: all.filter((a) => a.status === 'rejected').length,
      suspended: all.filter((a) => a.status === 'suspended').length,
      players: all.filter((a) => a.type === 'player').length,
      teams: all.filter((a) => a.type === 'team').length,
      creators: all.filter((a) => a.type === 'creator').length,
    };
  }
}
