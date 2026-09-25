import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
import { REDIS_CLIENT } from '../../shared/constants/redis.constants';
import { IRedisClient } from '../../redis/redis.types';

const ARTICLES_PER_PAGE = 6;

const ARTICLE_CACHE_PREFIX = 'article:';
const ARTICLES_CACHE_PREFIX = 'articles:page:';
const LAST_ARTICLES_CACHE_KEY = 'articles:last';
const CATEGORY_CACHE_PREFIX = 'category:';
const TAG_CACHE_PREFIX = 'tag:';
const ARTICLE_CACHE_TTL_SECONDS = 60 * 60;

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: Model<ArticleDocument>,

    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,

    @InjectModel(Tag.name)
    private readonly tagModel: Model<TagDocument>,

    @Inject(REDIS_CLIENT)
    private readonly redisClient: IRedisClient,
  ) {}

  private async clearCacheByPattern(pattern: string): Promise<void> {
    for await (const keys of this.redisClient.scanIterator({
      MATCH: pattern,
    })) {
      for (const key of keys) {
        await this.redisClient.del(key);
      }
    }
  }

  async createArticle(article: ArticleDto): Promise<{ message: string }> {
    const words = article.content.trim().split(/\s+/).length;
    const wordsPerMinute = 160;
    const articleReadingTime = Math.ceil(words / wordsPerMinute);

    const category = await this.categoryModel.findById(article.category).exec();

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    const tags = await this.tagModel
      .find({
        _id: {
          $in: article.tags ?? [],
        },
      })
      .exec();

    await this.articleModel.create({
      ...article,
      readingTime: articleReadingTime,
      tags: article.tags ?? [],
    });

    await this.clearCacheByPattern(`${ARTICLES_CACHE_PREFIX}*`);
    await this.redisClient.del(LAST_ARTICLES_CACHE_KEY);
    await this.clearCacheByPattern(
      `${CATEGORY_CACHE_PREFIX}${category.slug}:page:*`,
    );
    for (const tag of tags) {
      await this.clearCacheByPattern(`${TAG_CACHE_PREFIX}${tag.slug}:page:*`);
    }

    return {
      message: 'Статья успешно создана',
    };
  }

  async getLastArticles(): Promise<ArticleListResponseDto[]> {
    const cachedArticles = await this.redisClient.get(LAST_ARTICLES_CACHE_KEY);

    if (cachedArticles) {
      return JSON.parse(cachedArticles);
    }

    const lastArticles = await this.articleModel
      .find({
        status: ArticleStatus.PUBLISHED,
      })
      .populate<{ category: CategoryDocument }>('category')
      .populate<{ tags: TagDocument[] }>('tags')
      .sort({ publishedAt: -1 })
      .limit(ARTICLES_PER_PAGE)
      .exec();

    if (lastArticles.length === 0) {
      throw new NotFoundException('Опубликованных статей нет');
    }

    await this.redisClient.set(
      LAST_ARTICLES_CACHE_KEY,
      JSON.stringify(lastArticles),
      { EX: ARTICLE_CACHE_TTL_SECONDS },
    );

    return lastArticles;
  }

  async getCategoryArticles(
    slug: string,
    page: number,
  ): Promise<{
    articles: ArticleListResponseDto[];
    totalCount: number;
  }> {
    const cacheKey = `${CATEGORY_CACHE_PREFIX}${slug}:page:${page}`;
    const cachedArticles = await this.redisClient.get(cacheKey);

    if (cachedArticles) {
      return JSON.parse(cachedArticles);
    }

    const category = await this.categoryModel.findOne({ slug }).exec();

    if (!category) {
      throw new NotFoundException(`Категория со slug "${slug}" не найдена`);
    }

    const skip = (page - 1) * ARTICLES_PER_PAGE;

    const articles = await this.articleModel
      .find({
        category: category._id,
        status: ArticleStatus.PUBLISHED,
      })
      .populate<{ category: CategoryDocument }>('category')
      .populate<{ tags: TagDocument[] }>('tags')
      .sort({ publishedAt: -1 })
      .limit(ARTICLES_PER_PAGE)
      .skip(skip)
      .exec();

    const totalCount = await this.articleModel
      .countDocuments({
        category: category._id,
        status: ArticleStatus.PUBLISHED,
      })
      .exec();

    const result = {
      articles,
      totalCount,
    };

    await this.redisClient.set(cacheKey, JSON.stringify(result), {
      EX: ARTICLE_CACHE_TTL_SECONDS,
    });

    return result;
  }

  async getTagArticles(
    slug: string,
    page: number,
  ): Promise<{
    articles: ArticleListResponseDto[];
    totalCount: number;
  }> {
    const cacheKey = `${TAG_CACHE_PREFIX}${slug}:page:${page}`;
    const cachedArticles = await this.redisClient.get(cacheKey);

    if (cachedArticles) {
      return JSON.parse(cachedArticles);
    }

    const tag = await this.tagModel.findOne({ slug }).exec();

    if (!tag) {
      throw new NotFoundException(`Тэг со slug "${slug}" не найден`);
    }

    const skip = (page - 1) * ARTICLES_PER_PAGE;

    const articles = await this.articleModel
      .find({
        tags: tag._id,
        status: ArticleStatus.PUBLISHED,
      })
      .populate<{ category: CategoryDocument }>('category')
      .populate<{ tags: TagDocument[] }>('tags')
      .sort({ publishedAt: -1 })
      .limit(ARTICLES_PER_PAGE)
      .skip(skip)
      .exec();

    const totalCount = await this.articleModel
      .countDocuments({
        tags: tag._id,
        status: ArticleStatus.PUBLISHED,
      })
      .exec();

    const result = { articles, totalCount };

    await this.redisClient.set(cacheKey, JSON.stringify(result), {
      EX: ARTICLE_CACHE_TTL_SECONDS,
    });

    return result;
  }

  async getAllArticles(
    page: number,
  ): Promise<{ articles: ArticleListResponseDto[]; totalCount: number }> {
    const skip = (page - 1) * ARTICLES_PER_PAGE;

    const cacheKey = `${ARTICLES_CACHE_PREFIX}${page}`;
    const cachedArticles = await this.redisClient.get(cacheKey);

    if (cachedArticles) {
      return JSON.parse(cachedArticles);
    }

    const articles = await this.articleModel
      .find({
        status: ArticleStatus.PUBLISHED,
      })
      .populate<{ category: CategoryDocument }>('category')
      .populate<{ tags: TagDocument[] }>('tags')
      .sort({ publishedAt: -1 })
      .limit(ARTICLES_PER_PAGE)
      .skip(skip)
      .exec();

    const totalCount = await this.articleModel
      .countDocuments({
        status: ArticleStatus.PUBLISHED,
      })
      .exec();

    const result = {
      articles,
      totalCount,
    };

    await this.redisClient.set(cacheKey, JSON.stringify(result), {
      EX: ARTICLE_CACHE_TTL_SECONDS,
    });

    return result;
  }

  async getArticle(slug: string): Promise<ArticleResponseDto> {
    const cacheKey = `${ARTICLE_CACHE_PREFIX}${slug}`;
    const cachedArticle = await this.redisClient.get(cacheKey);

    if (cachedArticle) {
      return JSON.parse(cachedArticle);
    }

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

    await this.redisClient.set(cacheKey, JSON.stringify(article), {
      EX: ARTICLE_CACHE_TTL_SECONDS,
    });

    return article;
  }
}
