import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  Application,
  Creator,
  News,
  Player,
  SiteSettings,
  Team,
  Tournament,
} from '../../entities';

@Injectable()
export class AdminService {
  constructor(
    private readonly dataSource: DataSource,
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

  /** Wipe seeded/demo content. Keeps admin users. */
  async clearContent() {
    await this.dataSource.query(`
      TRUNCATE TABLE
        applications, media, players, teams, creators,
        tournaments, news, partners, games, site_settings,
        merch_items
      RESTART IDENTITY CASCADE
    `);

    await this.dataSource.getRepository(SiteSettings).save({
      brandName: 'ARC Esports',
      taglineAr: '',
      taglineEn: '',
      social: {},
      stats: { players: 0, teams: 0, creators: 0, tournaments: 0 },
      contactEmail: 'contact@arcesports.com',
    });

    return {
      ok: true,
      message: 'Content cleared. Users kept. Add content from the admin dashboard.',
    };
  }
}
