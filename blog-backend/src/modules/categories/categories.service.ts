import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './categories.schema';
import { Model } from 'mongoose';
import {
  CategoryCreateResponseDto,
  CategoryDto,
  CategoryResponseDto,
} from './categories.schema.dto';
import { REDIS_CLIENT } from '../../shared/constants/redis.constants';
import { IRedisClient } from '../../redis/redis.types';

const CATEGORIES_CACHE_KEY = 'categories:all';
const CATEGORIES_CACHE_TTL_SECONDS = 60 * 60;

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,

    @Inject(REDIS_CLIENT)
    private readonly redisClient: IRedisClient,
  ) {}

  async postCategory(
    category: CategoryDto,
  ): Promise<CategoryCreateResponseDto> {
    const createCategory = await this.categoryModel.create(category);

    await this.redisClient.del(CATEGORIES_CACHE_KEY);

    return {
      createCategory,
    };
  }

  async getCategory(slug: string): Promise<CategoryResponseDto> {
    const category = await this.categoryModel
      .findOne({
        slug: slug,
      })
      .exec();

    if (!category) {
      throw new NotFoundException(`Категория с slug "${slug}" не найдена`);
    }

    return category;
  }

  async getCategories(): Promise<CategoryResponseDto[]> {
    const cachedCategories = await this.redisClient.get(CATEGORIES_CACHE_KEY);

    if (cachedCategories) {
      return JSON.parse(cachedCategories);
    }

    const categories = await this.categoryModel.find().exec();

    await this.redisClient.set(
      CATEGORIES_CACHE_KEY,
      JSON.stringify(categories),
      {
        EX: CATEGORIES_CACHE_TTL_SECONDS,
      },
    );

    return categories;
  }
}
