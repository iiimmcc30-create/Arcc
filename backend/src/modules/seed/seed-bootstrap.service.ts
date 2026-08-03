import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

/**
 * On boot, only ensure the admin account exists.
 * Content is managed exclusively from the admin dashboard (no demo seed).
 */
@Injectable()
export class SeedBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedBootstrapService.name);

  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  async onApplicationBootstrap() {
    const flag = (process.env.AUTO_SEED || 'true').trim().toLowerCase();
    if (flag === 'false' || flag === '0' || flag === 'off') return;

    try {
      const adminEmail = (process.env.ADMIN_EMAIL || 'madunitesp@gmail.com').toLowerCase();
      const adminPassword = process.env.ADMIN_PASSWORD || '494930Mm';
      const adminName = process.env.ADMIN_NAME || 'ARC Admin';

      const existing = await this.users.findOne({ where: { email: adminEmail } });
      if (existing) {
        this.logger.log(`Admin already present: ${adminEmail}`);
        return;
      }

      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await this.users.save(
        this.users.create({
          email: adminEmail,
          passwordHash,
          name: adminName,
          role: 'admin',
          active: true,
        }),
      );
      this.logger.log(`Admin user created: ${adminEmail}`);
    } catch (err) {
      this.logger.error(
        'Admin bootstrap failed',
        err instanceof Error ? err.stack : String(err),
      );
    }
  }
}
