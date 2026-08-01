import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Application,
  Creator,
  News,
  Player,
  Team,
  Tournament,
} from '../../entities';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Application) private readonly apps: Repository<Application>,
    @InjectRepository(Player) private readonly players: Repository<Player>,
    @InjectRepository(Team) private readonly teams: Repository<Team>,
    @InjectRepository(Creator) private readonly creators: Repository<Creator>,
    @InjectRepository(Tournament) private readonly tournaments: Repository<Tournament>,
    @InjectRepository(News) private readonly news: Repository<News>,
  ) {}

  async dashboard() {
    const applications = await this.apps.find({ order: { createdAt: 'DESC' } });
    const [playersCount, teamsCount, creatorsCount, tournamentsCount, newsCount] =
      await Promise.all([
        this.players.count(),
        this.teams.count(),
        this.creators.count(),
        this.tournaments.count(),
        this.news.count(),
      ]);

    return {
      players: playersCount,
      teams: teamsCount,
      creators: creatorsCount,
      tournaments: tournamentsCount,
      news: newsCount,
      applications: {
        total: applications.length,
        pending: applications.filter((a) => a.status === 'pending').length,
        approved: applications.filter((a) => a.status === 'approved').length,
        rejected: applications.filter((a) => a.status === 'rejected').length,
        suspended: applications.filter((a) => a.status === 'suspended').length,
      },
      recent: applications.slice(0, 8),
    };
  }
}
