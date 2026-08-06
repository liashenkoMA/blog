import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { UserModule } from '../user/user.module';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Module({
  imports: [UserModule],
  controllers: [FileController],
  providers: [FileService, JwtAuthGuard],
})
export class FileModule {}
