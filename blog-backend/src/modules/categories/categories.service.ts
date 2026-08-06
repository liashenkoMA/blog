import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './categories.schema';
import { Model } from 'mongoose';
import {
  CategoryCreateResponseDto,
  CategoryDto,
  CategoryResponseDto,
} from './categories.schema.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async postCategory(
    category: CategoryDto,
  ): Promise<CategoryCreateResponseDto> {
    const createCategory = await this.categoryModel.create(category);

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
    const categories = await this.categoryModel.find().exec();

    return categories;
  }
}
