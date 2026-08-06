import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag, TagDocument } from './tags.schema';
import {
  TagCreateResponseDto,
  TagDto,
  TagResponseDto,
} from './tags.schema.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name)
    private readonly tagModel: Model<TagDocument>,
  ) {}

  async postTag(tag: TagDto): Promise<TagCreateResponseDto> {
    const createTag = await this.tagModel.create(tag);

    return {
      createTag,
    };
  }

  async getTag(slug: string): Promise<TagResponseDto> {
    const tag = await this.tagModel
      .findOne({
        slug: slug,
      })
      .exec();

    if (!tag) {
      throw new NotFoundException(`Тэг с slug "${slug}" не найден`);
    }

    return tag;
  }

  async getTags(): Promise<TagResponseDto[]> {
    const tags = await this.tagModel.find().exec();

    return tags;
  }
}
