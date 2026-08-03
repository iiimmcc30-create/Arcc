import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get('dashboard')
  @Roles('admin', 'supervisor')
  dashboard() {
    return this.service.dashboard();
  }

  @Post('clear-content')
  @Roles('admin')
  clearContent() {
    return this.service.clearContent();
  }
}
