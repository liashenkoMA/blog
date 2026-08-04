import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ROUTES } from '../../shared/constants/routes.constant';
import { CategoryDto } from './categories.schema.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller(ROUTES.CATEGORY)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  postCategory(@Body() category: CategoryDto) {
    return this.categoriesService.postCategory(category);
  }

  @Get(ROUTES.CATEGORY_GET)
  getCategory(@Param('slug') slug: string) {
    return this.categoriesService.getCategory(slug);
  }

  @Get()
  getCategories() {
    return this.categoriesService.getCategories();
  }
}
