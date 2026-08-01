import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSettings } from '../../entities';

@Injectable()
export class SiteService {
  constructor(
    @InjectRepository(SiteSettings) private readonly repo: Repository<SiteSettings>,
  ) {}

  async get() {
    let settings = await this.repo.findOne({ where: { id: 1 } });
    if (!settings) {
      settings = await this.repo.save(
        this.repo.create({
          brandName: 'ARC Esports',
          taglineAr: 'نصنع الأبطال… ونبني مستقبل صناع المحتوى.',
          taglineEn: 'We create champions… and build the future of content creators.',
          social: {
            discord: 'https://discord.gg/arcesports',
            tiktok: 'https://tiktok.com/@arcesports',
            youtube: 'https://youtube.com/@arcesports',
            kick: 'https://kick.com/arcesports',
            twitch: 'https://twitch.tv/arcesports',
            email: 'contact@arcesports.com',
          },
          stats: { players: 26, teams: 4, creators: 3, tournaments: 17 },
          contactEmail: 'contact@arcesports.com',
          heroVideoUrl: null,
        }),
      );
    }
    return settings;
  }

  async update(data: Partial<SiteSettings>) {
    const settings = await this.get();
    Object.assign(settings, data);
    return this.repo.save(settings);
  }
}
