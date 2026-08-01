import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchItem } from '../../entities/merch.entity';
import { MerchController } from './merch.controller';
import { MerchService } from './merch.service';

@Module({
  imports: [TypeOrmModule.forFeature([MerchItem])],
  controllers: [MerchController],
  providers: [MerchService],
  exports: [MerchService],
})
export class MerchModule {}
