import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import { User } from './user.schema';
import {
  CreateUserDto,
  GetUserResponseDto,
  UpdateUserDto,
  UpdateUserResponseDto,
} from './user.schema.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  private async validateAndGetPayload(request: Request) {
    const token = request?.cookies?.['session_blog_lm'];

    if (!token) {
      throw new UnauthorizedException('Не авторизованы');
    }

    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string }>(
        token,
        {
          secret: process.env.JWT_CONSTANT,
        },
      );
      return payload;
    } catch {
      throw new UnauthorizedException('Невалидный токен');
    }
  }

  async createUser(user: CreateUserDto): Promise<{ message: string }> {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(user.password, salt);

    const createUser = new this.userModel({
      name: user.name,
      email: user.email,
      password: password,
    });

    await createUser.save();

    return {
      message: 'Готово.',
    };
  }

  async getUser(): Promise<GetUserResponseDto> {
    const user = await this.userModel.findOne().exec();

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    return {
      name: user.name,
      email: user.email,
      avatarLink: user.avatarLink,
      telegram: user.telegram,
      vk: user.vk,
      gitHub: user.gitHub,
      linkedin: user.linkedin,
      mySite: user.mySite,
    };
  }

  async updateUser(
    userData: UpdateUserDto,
    request: Request,
  ): Promise<UpdateUserResponseDto> {
    const payload = await this.validateAndGetPayload(request);

    const updatedUser = await this.userModel
      .findByIdAndUpdate(payload.sub, userData, {
        new: true,
        runValidators: true,
      })
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Такого пользователя не существует');
    }

    return {
      name: updatedUser.name,
      email: updatedUser.email,
      avatarLink: updatedUser.avatarLink,
      telegram: updatedUser.telegram,
      vk: updatedUser.vk,
      gitHub: updatedUser.gitHub,
      linkedin: updatedUser.linkedin,
      mySite: updatedUser.mySite,
    };
  }
}
