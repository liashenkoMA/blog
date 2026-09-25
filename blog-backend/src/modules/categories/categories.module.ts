import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './categories.schema';
import { UserModule } from '../user/user.module';
import { RedisModule } from '@/src/redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    UserModule,
    RedisModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
