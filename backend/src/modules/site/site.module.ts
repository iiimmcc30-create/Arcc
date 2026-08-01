import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteSettings } from '../../entities';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';

@Module({
  imports: [TypeOrmModule.forFeature([SiteSettings])],
  controllers: [SiteController],
  providers: [SiteService],
  exports: [SiteService],
})
export class SiteModule {}
