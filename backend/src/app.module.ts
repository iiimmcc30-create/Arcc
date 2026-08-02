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
import {
  describeDatabaseTarget,
  resolvePostgresSsl,
} from './database/postgres-ssl';
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
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        const isProd = config.get<string>('NODE_ENV') === 'production';

        if (isProd && !databaseUrl) {
          throw new Error(
            'DATABASE_URL is required in production. Link the Railway Postgres plugin and set DATABASE_URL=${{Postgres.DATABASE_URL}} on this service.',
          );
        }

        const ssl = resolvePostgresSsl(databaseUrl, config.get<string>('DB_SSL'));
        console.log(
          `[db] target=${describeDatabaseTarget(databaseUrl)} ssl=${ssl ? 'on' : 'off'}`,
        );

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
          ssl,
          retryAttempts: 10,
          retryDelay: 3000,
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
    HealthModule,
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
