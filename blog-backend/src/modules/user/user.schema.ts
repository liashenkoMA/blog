import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    trim: true,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  })
  name: string;

  @Prop({
    unique: true,
    required: true,
    trim: true,
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  avatarLink: string;

  @Prop()
  telegram: string;

  @Prop()
  vk: string;

  @Prop()
  gitHub: string;

  @Prop()
  linkedin: string;

  @Prop()
  mySite: string;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
