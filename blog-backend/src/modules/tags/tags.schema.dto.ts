import { Types } from 'mongoose';

export class TagDto {
  slug: string;
  name: string;
  image: string;
  imageAlt: string;
  title: string;
  description: string;
}

export class TagResponseDto {
  _id: Types.ObjectId;
  slug: string;
  name: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export class TagCreateResponseDto {
  createTag: TagResponseDto;
}
