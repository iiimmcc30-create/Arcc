import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { SeedBootstrapService } from './seed-bootstrap.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [SeedBootstrapService],
})
export class SeedModule {}
