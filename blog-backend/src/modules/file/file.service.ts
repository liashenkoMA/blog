import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import path from 'path';

@Injectable()
export class FileService {
  private readonly uploadPath = path.join(process.cwd(), 'uploads');

  async addFile(file: Express.Multer.File) {
    return {
      filePath: `${process.env.URL_UPLOADIMG}/uploads/${file.filename}`,
    };
  }

  async getFiles() {
    const files = await fs.readdir(this.uploadPath);

    return files.map((file) => ({
      filePath: `${process.env.URL_UPLOADIMG}/uploads/${file}`,
    }));
  }

  async getFile(filename: string) {
    const filePath = path.join(this.uploadPath, filename);

    await fs.stat(filePath);

    return {
      filePath: `${process.env.URL_UPLOADIMG}/uploads/${filename}`,
    };
  }

  async deleteFile(filename: string) {
    const filePath = path.join(this.uploadPath, filename);

    await fs.unlink(filePath);

    return {
      message: 'Файл удалён.',
    };
  }
}
