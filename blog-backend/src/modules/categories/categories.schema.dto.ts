import { Types } from 'mongoose';

export class CategoryDto {
  slug: string;
  name: string;
  image: string;
  imageAlt: string;
  title: string;
  description: string;
}

export class CategoryResponseDto {
  _id: Types.ObjectId;
  slug: string;
  name: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export class CategoryCreateResponseDto {
  createCategory: CategoryResponseDto;
}
