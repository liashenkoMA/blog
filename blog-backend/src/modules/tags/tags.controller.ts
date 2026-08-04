import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ROUTES } from '../../shared/constants/routes.constant';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { TagDto } from './tags.schema.dto';
import { TagsService } from './tags.service';

@Controller(ROUTES.TAG)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  postTag(@Body() tag: TagDto) {
    return this.tagsService.postTag(tag);
  }

  @Get(ROUTES.TAG_GET)
  getTag(@Param('slug') slug: string) {
    return this.tagsService.getTag(slug);
  }

  @Get()
  getTags() {
    return this.tagsService.getTags();
  }
}
