import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum ArticleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  h1: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: Types.ObjectId;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Tag' }],
    default: [],
  })
  tags: Types.ObjectId[];

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  imageAlt: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  readingTime: number;

  @Prop({
    type: String,
    enum: ArticleStatus,
    default: ArticleStatus.DRAFT,
  })
  status: ArticleStatus;

  @Prop()
  publishedAt?: Date;
}

export type ArticleDocument = HydratedDocument<Article>;

export const ArticleSchema = SchemaFactory.createForClass(Article);

ArticleSchema.index({
  status: 1,
  publishedAt: -1,
});

ArticleSchema.index({
  category: 1,
  status: 1,
  publishedAt: -1,
});

ArticleSchema.index({
  tags: 1,
  status: 1,
  publishedAt: -1,
});
