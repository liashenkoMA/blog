import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleDto } from './article.schema.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ROUTES } from '../../shared/constants/routes.constant';

@Controller(ROUTES.ARTICLE)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createArticle(@Body() article: ArticleDto) {
    return this.articleService.createArticle(article);
  }

  @Get(ROUTES.ARTICLE_LAST)
  async getLastArticles() {
    return this.articleService.getLastArticles();
  }

  @Get(ROUTES.ARTICLE_CATEGORY)
  async getCategoryArticles(
    @Param('slug') slug: string,
    @Query('page') page: number,
  ) {
    return this.articleService.getCategoryArticles(slug, page);
  }

  @Get(ROUTES.ARTICLE_TAG)
  async getTagArticles(
    @Param('slug') slug: string,
    @Query('page') page: number,
  ) {
    return this.articleService.getTagArticles(slug, page);
  }

  @Get()
  async getAllArticles(@Query('page') page: number) {
    return this.articleService.getAllArticles(page);
  }

  @Get(ROUTES.ARTICLE_GET)
  async getArticle(@Param('slug') slug: string) {
    return this.articleService.getArticle(slug);
  }
}
