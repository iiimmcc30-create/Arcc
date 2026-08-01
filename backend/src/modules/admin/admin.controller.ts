import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'supervisor')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get('dashboard')
  dashboard() {
    return this.service.dashboard();
  }
}
