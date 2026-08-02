import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.schema';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import {
  CreateUserDto,
  GetUserResponseDto,
  UpdateUserDto,
} from './user.schema.dto';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let mockJwtService;
  let mockUserModel;

  beforeEach(async () => {
    jest.resetAllMocks();

    mockUserModel = jest.fn();

    mockUserModel.findById = jest.fn();
    mockUserModel.findByIdAndUpdate = jest.fn();

    mockJwtService = {
      verifyAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('validateAndGetPayload', () => {
    it('Ошибка пользователь не авторизован', async () => {
      const request = { cookies: {} };

      await expect(
        (service as any).validateAndGetPayload(request),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Ошибка невалидный токен', async () => {
      const request = { cookies: { session_blog_lm: '1234' } };

      mockJwtService.verifyAsync.mockRejectedValue(new Error());

      await expect(
        (service as any).validateAndGetPayload(request),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('1234', {
        secret: process.env.JWT_CONSTANT,
      });
      expect(mockJwtService.verifyAsync).toHaveBeenCalledTimes(1);
    });

    it('Пользователь найден', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ sub: 'user_id' });

      const request = {
        cookies: { session_blog_lm: 'valid_token' },
      } as unknown as Request;

      const result = await (service as any).validateAndGetPayload(request);

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid_token', {
        secret: process.env.JWT_CONSTANT,
      });
      expect(mockJwtService.verifyAsync).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ sub: 'user_id' });
    });
  });

  describe('createUser', () => {
    it('Пользователь успешно создан', async () => {
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt');
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hash');

      const saveMock = jest.fn().mockResolvedValue({
        _id: 'user_id',
      });

      mockUserModel.mockImplementation(() => ({
        save: saveMock,
      }));

      const dto: CreateUserDto = {
        name: 'Иван',
        email: 'test@mail.com',
        password: '123',
      };

      const result = await service.createUser(dto);

      expect(result).toEqual({
        message: 'Готово.',
      });
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('123', 'salt');
      expect(mockUserModel).toHaveBeenCalledWith({
        name: 'Иван',
        email: 'test@mail.com',
        password: 'hash',
      });
      expect(saveMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUser', () => {
    it('Ошибка пользователь не существует', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ sub: 'user_id' });

      const request = {
        cookies: { session_blog_lm: 'valid_token' },
      } as unknown as Request;

      const execMock = jest.fn().mockResolvedValue(null);

      mockUserModel.findById.mockReturnValue({
        exec: execMock,
      });

      await expect(service.getUser(request)).rejects.toThrow(NotFoundException);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid_token', {
        secret: process.env.JWT_CONSTANT,
      });
      expect(mockUserModel.findById).toHaveBeenCalledWith('user_id');
      expect(mockUserModel.findById).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledTimes(1);
    });

    it('Успешное получение пользователя', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ sub: 'user_id' });

      const request = {
        cookies: { session_blog_lm: 'valid_token' },
      } as unknown as Request;

      const user = {
        name: 'Иван',
        email: 'test@mail.com',
        avatarLink: 'avatar.jpg',
        telegram: '@ivan',
        vk: 'vk.com/ivan',
        gitHub: 'github.com/ivan',
        linkedin: 'linkedin.com/in/ivan',
        mySite: 'ivan.ru',
      };

      const execMock = jest.fn().mockResolvedValue(user);

      mockUserModel.findById.mockReturnValue({
        exec: execMock,
      });

      const result = await service.getUser(request);

      expect(mockUserModel.findById).toHaveBeenCalledWith('user_id');
      expect(mockUserModel.findById).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        name: 'Иван',
        email: 'test@mail.com',
        avatarLink: 'avatar.jpg',
        telegram: '@ivan',
        vk: 'vk.com/ivan',
        gitHub: 'github.com/ivan',
        linkedin: 'linkedin.com/in/ivan',
        mySite: 'ivan.ru',
      });
    });
  });

  describe('updateUser', () => {
    it('Ошибка пользователь не найден', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ sub: 'user_id' });

      const request = {
        cookies: { session_blog_lm: 'valid_token' },
      } as unknown as Request;

      const dto: UpdateUserDto = {
        telegram: '@ivan',
      };

      const execMock = jest.fn().mockResolvedValue(null);
      const selectMock = jest.fn().mockReturnValue({
        exec: execMock,
      });

      mockUserModel.findByIdAndUpdate.mockReturnValue({
        select: selectMock,
      });

      await expect(service.updateUser(dto, request)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'user_id',
        dto,
        {
          new: true,
          runValidators: true,
        },
      );
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(selectMock).toHaveBeenCalledWith('-password');
      expect(execMock).toHaveBeenCalledTimes(1);
    });

    it('Успешное обновление пользователя', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ sub: 'user_id' });

      const request = {
        cookies: { session_blog_lm: 'valid_token' },
      } as unknown as Request;

      const dto: UpdateUserDto = {
        name: 'Максим',
        telegram: '@maks',
      };

      const updatedUser: GetUserResponseDto = {
        name: 'Максим',
        email: 'test@mail.com',
        avatarLink: 'avatar.jpg',
        telegram: '@maks',
        vk: 'vk.com/maks',
        gitHub: 'github.com/maks',
        linkedin: 'linkedin.com/in/maks',
        mySite: 'maks.ru',
      };

      const execMock = jest.fn().mockResolvedValue(updatedUser);
      const selectMock = jest.fn().mockReturnValue({
        exec: execMock,
      });

      mockUserModel.findByIdAndUpdate.mockReturnValue({
        select: selectMock,
      });

      const result = await service.updateUser(dto, request);

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'user_id',
        dto,
        {
          new: true,
          runValidators: true,
        },
      );
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(selectMock).toHaveBeenCalledWith('-password');
      expect(execMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        name: 'Максим',
        email: 'test@mail.com',
        avatarLink: 'avatar.jpg',
        telegram: '@maks',
        vk: 'vk.com/maks',
        gitHub: 'github.com/maks',
        linkedin: 'linkedin.com/in/maks',
        mySite: 'maks.ru',
      });
    });
  });
});
