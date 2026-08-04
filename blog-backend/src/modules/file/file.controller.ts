import { ROUTES } from '../../shared/constants/routes.constant';
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller(ROUTES.FILE)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(JwtAuthGuard)
  @Post(ROUTES.FILE_ADD)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const name = path.parse(file.originalname).name;
          const extension = path.extname(file.originalname);

          const newFileName =
            name.split(' ').join('_') + '_' + Date.now() + extension;

          cb(null, newFileName);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Разрешены только JPG, PNG и WebP'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  addFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.fileService.addFile(file);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getFiles() {
    return this.fileService.getFiles();
  }

  @UseGuards(JwtAuthGuard)
  @Get(ROUTES.FILE_GET)
  getFile(@Param('filename') file: string) {
    return this.fileService.getFile(file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(ROUTES.FILE_DELETE)
  deleteFile(@Param('filename') file: string) {
    return this.fileService.deleteFile(file);
  }
}
