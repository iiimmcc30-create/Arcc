import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus, ApplicationType } from '../../entities/application.entity';
import { Creator } from '../../entities/creator.entity';
import { Player } from '../../entities/player.entity';
import { Team } from '../../entities/team.entity';
import { CreateApplicationDto } from './dto/create-application.dto';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=600&fit=crop&auto=format';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application) private readonly repo: Repository<Application>,
    @InjectRepository(Player) private readonly players: Repository<Player>,
    @InjectRepository(Team) private readonly teams: Repository<Team>,
    @InjectRepository(Creator) private readonly creators: Repository<Creator>,
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
    const wasApproved = app.status === 'approved';
    app.status = status;
    if (adminNotes !== undefined) app.adminNotes = adminNotes;
    const saved = await this.repo.save(app);

    if (status === 'approved' && !wasApproved) {
      await this.promoteToRoster(saved);
    }
    return saved;
  }

  private async promoteToRoster(app: Application) {
    if (app.type === 'player') {
      const existing = await this.players.findOne({ where: { name: app.name } });
      if (existing) return;
      const achievements = (app.achievements || '')
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean);
      await this.players.save(
        this.players.create({
          name: app.name,
          game: app.game || 'ARC',
          country: app.country || '',
          countryEn: app.country || '',
          flag: '',
          role: app.role || 'Player',
          rank: app.rank || '',
          image: DEFAULT_IMAGE,
          achievements,
          achievementsEn: achievements,
          social: {
            discord: app.discord || '',
            profile: app.profileLink || '',
            ...(app.social || {}),
          },
        }),
      );
      return;
    }

    if (app.type === 'team') {
      const name = app.teamName || app.name;
      const existing = await this.teams.findOne({ where: { name } });
      if (existing) return;
      const achievements = (app.achievements || '')
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean);
      await this.teams.save(
        this.teams.create({
          name,
          game: app.game || 'ARC',
          logo: DEFAULT_IMAGE,
          players: app.playerCount || 0,
          captain: app.captain || app.name,
          achievements,
          achievementsEn: achievements,
          tournaments: app.uid ? [app.uid] : [],
        }),
      );
      return;
    }

    if (app.type === 'creator') {
      const existing = await this.creators.findOne({ where: { name: app.name } });
      if (existing) return;
      await this.creators.save(
        this.creators.create({
          name: app.name,
          nameAr: app.name,
          bio: app.bio || app.message || '',
          bioEn: app.bio || app.message || '',
          image: DEFAULT_IMAGE,
          verified: false,
          platforms: app.platforms || (app.platform ? { [app.platform]: app.followers || '' } : {}),
          social: app.social || {},
        }),
      );
    }
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
