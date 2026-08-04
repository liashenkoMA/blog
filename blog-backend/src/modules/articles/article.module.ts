import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from './article.schema';
import { Category, CategorySchema } from '../categories/categories.schema';
import { Tag, TagSchema } from '../tags/tags.schema';

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
  ],
  controllers: [],
  providers: [],
})
export class ArticlesModule {}
