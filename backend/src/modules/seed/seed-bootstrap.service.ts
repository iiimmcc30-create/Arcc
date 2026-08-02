import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { runSeed } from '../../seed/seed';

@Injectable()
export class SeedBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedBootstrapService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    // Default on in production so Railway gets content without a manual shell step.
    // Set AUTO_SEED=false to disable.
    const flag = (process.env.AUTO_SEED || (process.env.NODE_ENV === 'production' ? 'true' : 'false'))
      .trim()
      .toLowerCase();
    if (flag === 'false' || flag === '0' || flag === 'off') {
      return;
    }

    try {
      const result = await runSeed(this.dataSource, { onlyIfEmpty: true });
      if (result.seeded) {
        this.logger.log('Initial content + admin user seeded (database was empty)');
      }
    } catch (err) {
      this.logger.error('Auto-seed failed', err instanceof Error ? err.stack : String(err));
    }
  }
}
