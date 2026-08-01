import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SiteService } from './site.service';

@Controller('site')
export class SiteController {
  constructor(private readonly service: SiteService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'supervisor')
  @Patch()
  update(@Body() body: Record<string, unknown>) {
    return this.service.update(body as any);
  }
}
