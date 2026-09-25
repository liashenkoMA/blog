import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag, TagDocument } from './tags.schema';
import {
  TagCreateResponseDto,
  TagDto,
  TagResponseDto,
} from './tags.schema.dto';
import { REDIS_CLIENT } from '../../shared/constants/redis.constants';
import { IRedisClient } from '../../redis/redis.types';

const TAGS_CACHE_KEY = 'tags:all';
const TAGS_CACHE_TTL_SECONDS = 60 * 60;

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name)
    private readonly tagModel: Model<TagDocument>,

    @Inject(REDIS_CLIENT)
    private readonly redisClient: IRedisClient,
  ) {}

  async postTag(tag: TagDto): Promise<TagCreateResponseDto> {
    const createTag = await this.tagModel.create(tag);

    await this.redisClient.del(TAGS_CACHE_KEY);

    return {
      createTag,
    };
  }

  async getTag(slug: string): Promise<TagResponseDto> {
    const tag = await this.tagModel
      .findOne({
        slug,
      })
      .exec();

    if (!tag) {
      throw new NotFoundException(`Тэг с slug "${slug}" не найден`);
    }

    return tag;
  }

  async getTags(): Promise<TagResponseDto[]> {
    const cachedTags = await this.redisClient.get(TAGS_CACHE_KEY);

    if (cachedTags) {
      return JSON.parse(cachedTags);
    }

    const tags = await this.tagModel.find().exec();

    await this.redisClient.set(TAGS_CACHE_KEY, JSON.stringify(tags), {
      EX: TAGS_CACHE_TTL_SECONDS,
    });

    return tags;
  }
}
