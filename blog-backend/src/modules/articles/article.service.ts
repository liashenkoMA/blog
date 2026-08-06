import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Article, ArticleDocument, ArticleStatus } from './article.schema';
import {
  ArticleDto,
  ArticleListResponseDto,
  ArticleResponseDto,
} from './article.schema.dto';
import { Category, CategoryDocument } from '../categories/categories.schema';
import { Tag, TagDocument } from '../tags/tags.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: Model<ArticleDocument>,

    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,

    @InjectModel(Tag.name)
    private readonly tagModel: Model<TagDocument>,
  ) {}

  async createArticle(article: ArticleDto): Promise<{ message: string }> {
    const words = article.content.trim().split(/\s+/).length;
    const wordsPerMinute = 160;
    const articleReadingTime = Math.ceil(words / wordsPerMinute);

    await this.articleModel.create({
      ...article,
      readingTime: articleReadingTime,
      tags: article.tags ?? [],
    });

    return {
      message: 'Статья успешно создана',
    };
  }

  async getLastArticles(): Promise<ArticleListResponseDto[]> {
    const lastArticles = await this.articleModel
      .find({
        status: ArticleStatus.PUBLISHED,
      })
      .populate<{ category: CategoryDocument }>('category')
      .populate<{ tags: TagDocument[] }>('tags')
      .sort({ publishedAt: -1 })
      .limit(6)
      .exec();

    if (lastArticles.length === 0) {
      throw new NotFoundException('Опубликованных статей нет');
    }

    return lastArticles;
  }

  async getCategoryArticles(
    slug: string,
    page: number,
  ): Promise<{
    categoryArticles: ArticleListResponseDto[];
    totalCount: number;
  }> {
    const category = await this.categoryModel.findOne({ slug }).exec();

    if (!category) {
      throw new NotFoundException(`Категория со slug "${slug}" не найдена`);
    }

    const limit = 6;
    const skip = (page - 1) * limit;

    const categoryArticles = await this.articleModel
      .find({
        category: category._id,
        status: ArticleStatus.PUBLISHED,
      })
      .populate<{ category: CategoryDocument }>('category')
      .populate<{ tags: TagDocument[] }>('tags')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();

    const totalCount = await this.articleModel
      .countDocuments({
        category: category._id,
        status: ArticleStatus.PUBLISHED,
      })
      .exec();

    if (categoryArticles.length === 0) {
      throw new NotFoundException('Статьи не найдены');
    }

    return { categoryArticles, totalCount };
  }

  async getTagArticles(
    slug: string,
    page: number,
  ): Promise<{
    tagArticles: ArticleListResponseDto[];
    totalCount: number;
  }> {
    const tag = await this.tagModel.findOne({ slug }).exec();

    if (!tag) {
      throw new NotFoundException(`Тэг со slug "${slug}" не найден`);
    }

    const limit = 6;
    const skip = (page - 1) * limit;

    const tagArticles = await this.articleModel
      .find({
        tags: tag._id,
        status: ArticleStatus.PUBLISHED,
      })
      .populate<{ category: CategoryDocument }>('category')
      .populate<{ tags: TagDocument[] }>('tags')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();

    const totalCount = await this.articleModel
      .countDocuments({
        tags: tag._id,
        status: ArticleStatus.PUBLISHED,
      })
      .exec();

    if (tagArticles.length === 0) {
      throw new NotFoundException('Статьи не найдены');
    }

    return { tagArticles, totalCount };
  }

  async getAllArticles(
    page: number,
  ): Promise<{ articles: ArticleListResponseDto[]; totalCount: number }> {
    const limit = 6;
    const skip = (page - 1) * limit;

    const articles = await this.articleModel
      .find({
        status: ArticleStatus.PUBLISHED,
      })
      .populate<{ category: CategoryDocument }>('category')
      .populate<{ tags: TagDocument[] }>('tags')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();

    if (articles.length === 0) {
      throw new NotFoundException('Опубликованных статей нет');
    }

    const totalCount = await this.articleModel
      .countDocuments({
        status: ArticleStatus.PUBLISHED,
      })
      .exec();

    return { articles, totalCount };
  }

  async getArticle(slug: string): Promise<ArticleResponseDto> {
    const article = await this.articleModel
      .findOne({
        slug,
        status: ArticleStatus.PUBLISHED,
      })
      .populate<{ category: CategoryDocument }>('category')
      .populate<{ tags: TagDocument[] }>('tags')
      .exec();

    if (!article) {
      throw new NotFoundException(`Статья со slug "${slug}" не найдена`);
    }

    return article;
  }
}
