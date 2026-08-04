import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './categories.schema';
import { Model } from 'mongoose';
import { CategoryDto } from './categories.schema.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async postCategory(category: CategoryDto) {
    const createCategory = await this.categoryModel.create(category);

    return {
      createCategory,
    };
  }

  async getCategory(slug: string) {
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

  async getCategories() {
    const categories = await this.categoryModel.find().exec();

    return categories;
  }
}
