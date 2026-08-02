import { Module } from '@nestjs/common';
import { SeedBootstrapService } from './seed-bootstrap.service';

@Module({
  providers: [SeedBootstrapService],
})
export class SeedModule {}
