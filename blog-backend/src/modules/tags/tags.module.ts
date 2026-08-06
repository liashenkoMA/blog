import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag, TagSchema } from './tags.schema';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
    UserModule,
  ],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
