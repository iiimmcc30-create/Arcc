import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Application,
  Creator,
  Game,
  Media,
  MerchItem,
  News,
  Partner,
  Player,
  SiteSettings,
  Team,
  Tournament,
  User,
} from './entities';
import { GamesModule } from './modules/games/games.module';
import { TeamsModule } from './modules/teams/teams.module';
import { PlayersModule } from './modules/players/players.module';
import { CreatorsModule } from './modules/creators/creators.module';
import { TournamentsModule } from './modules/tournaments/tournaments.module';
import { NewsModule } from './modules/news/news.module';
import { PartnersModule } from './modules/partners/partners.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { MediaModule } from './modules/media/media.module';
import { AdminModule } from './modules/admin/admin.module';
import { SiteModule } from './modules/site/site.module';
import { AuthModule } from './modules/auth/auth.module';
import { MerchModule } from './modules/merch/merch.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        const common = {
          entities: [
            Game,
            Team,
            Player,
            Creator,
            Tournament,
            News,
            Partner,
            Application,
            Media,
            SiteSettings,
            User,
            MerchItem,
          ],
          synchronize: true,
          ssl:
            config.get('DB_SSL') === 'true' || databaseUrl?.includes('railway')
              ? { rejectUnauthorized: false }
              : false,
        };
        if (databaseUrl) {
          return {
            type: 'postgres' as const,
            url: databaseUrl,
            ...common,
          };
        }
        return {
          type: 'postgres' as const,
          host: config.get<string>('DB_HOST', 'localhost'),
          port: parseInt(config.get<string>('DB_PORT', '5432') ?? '5432', 10),
          username: config.get<string>('DB_USERNAME', 'arc'),
          password: config.get<string>('DB_PASSWORD', 'arc_secret'),
          database: config.get<string>('DB_DATABASE', 'arc_esports'),
          ...common,
        };
      },
    }),
    AuthModule,
    GamesModule,
    TeamsModule,
    PlayersModule,
    CreatorsModule,
    TournamentsModule,
    NewsModule,
    PartnersModule,
    ApplicationsModule,
    MediaModule,
    AdminModule,
    SiteModule,
    MerchModule,
  ],
})
export class AppModule {}
