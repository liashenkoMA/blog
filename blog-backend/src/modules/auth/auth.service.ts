import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginResponseDto, LoginUserDto } from '../user/user.schema.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(user: LoginUserDto): Promise<LoginResponseDto> {
    const userData = await this.userModel.findOne({ email: user.email }).exec();

    if (!userData) {
      throw new UnauthorizedException('Пользователя не существует');
    }

    const isValidPassword = await bcrypt.compare(
      user.password,
      userData.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Пользователя не существует');
    }

    const payload = { sub: userData._id.toString() };
    const jwt = await this.jwtService.signAsync(payload);

    return {
      access_token: jwt,
    };
  }
}
