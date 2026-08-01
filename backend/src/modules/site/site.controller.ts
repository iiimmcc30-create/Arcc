import { Body, Controller, Get, Patch } from '@nestjs/common';
import { SiteService } from './site.service';

@Controller('site')
export class SiteController {
  constructor(private readonly service: SiteService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @Patch()
  update(@Body() body: Record<string, unknown>) {
    return this.service.update(body as any);
  }
}
