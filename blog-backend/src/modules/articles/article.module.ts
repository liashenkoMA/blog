import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from './article.schema';
import { Category, CategorySchema } from '../categories/categories.schema';
import { Tag, TagSchema } from '../tags/tags.schema';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { UserModule } from '../user/user.module';
import { RedisModule } from '../../redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Article.name,
        schema: ArticleSchema,
      },
      {
        name: Category.name,
        schema: CategorySchema,
      },
      {
        name: Tag.name,
        schema: TagSchema,
      },
    ]),
    UserModule,
    RedisModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticlesModule {}
