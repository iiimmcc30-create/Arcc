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
import {
  listPresentDbEnvKeys,
  resolveDatabaseUrl,
} from './database/resolve-database-url';
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
import { SeedModule } from './modules/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = resolveDatabaseUrl(process.env);
        const isProd = config.get<string>('NODE_ENV') === 'production';
        const present = listPresentDbEnvKeys(process.env);

        if (isProd && !databaseUrl) {
          throw new Error(
            `DATABASE_URL is required in production. Present DB-related env keys: [${present.join(', ') || 'none'}]. ` +
              'On the Railway web service Variables tab, set DATABASE_URL=${{Postgres.DATABASE_URL}} (and add a Postgres plugin if missing).',
          );
        }

        const ssl = resolvePostgresSsl(databaseUrl, config.get<string>('DB_SSL'));
        console.log(
          `[db] target=${describeDatabaseTarget(databaseUrl)} ssl=${ssl ? 'on' : 'off'} envKeys=[${present.join(', ')}]`,
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
          // Fail fast inside Railway's healthcheck window (default 120s).
          retryAttempts: isProd ? 3 : 10,
          retryDelay: 1500,
          extra: {
            connectionTimeoutMillis: 5000,
          },
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
    SeedModule,
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
