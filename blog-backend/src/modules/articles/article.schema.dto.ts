import { Types } from 'mongoose';
import { CategoryResponseDto } from '../categories/categories.schema.dto';
import { TagResponseDto } from '../tags/tags.schema.dto';
import { ArticleStatus } from './article.schema';

export class ArticleDto {
  slug: string;
  title: string;
  h1: string;
  description: string;
  category: string;
  tags?: string[];
  image: string;
  imageAlt: string;
  content: string;
  status?: ArticleStatus;
}

export class ArticleResponseDto {
  _id: Types.ObjectId;
  slug: string;
  title: string;
  h1: string;
  description: string;
  category: CategoryResponseDto;
  tags: TagResponseDto[];
  image: string;
  imageAlt: string;
  content: string;
  readingTime: number;
  status: ArticleStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class ArticleListResponseDto {
  _id: Types.ObjectId;
  slug: string;
  title: string;
  h1: string;
  description: string;
  category: CategoryResponseDto;
  tags: TagResponseDto[];
  image: string;
  imageAlt: string;
  readingTime: number;
  status: ArticleStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
