import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { getUploadDir } from '../../uploads/upload-path';
import { UploadsService } from './uploads.service';

const IMAGE_MIME = /^(image\/(jpeg|jpg|png|webp|gif|svg\+xml))$/i;

@Controller('uploads')
export class UploadsController {
  constructor(private readonly service: UploadsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'supervisor')
  @Get()
  list() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'supervisor')
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => cb(null, getUploadDir()),
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname || '').toLowerCase() || '.jpg';
          cb(null, `${Date.now()}-${randomUUID()}${ext}`);
        },
      }),
      limits: { fileSize: 8 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!IMAGE_MIME.test(file.mimetype)) {
          return cb(new BadRequestException('Only image files are allowed') as any, false);
        }
        cb(null, true);
      },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { user?: { email?: string; id?: number } },
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded (field name must be "file")');
    }
    const saved = await this.service.createFromFile(file, req.user?.email || null);
    return saved;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
