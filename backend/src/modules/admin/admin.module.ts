import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Application,
  Creator,
  Player,
  Team,
  Tournament,
  News,
} from '../../entities';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, Player, Team, Creator, Tournament, News]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
