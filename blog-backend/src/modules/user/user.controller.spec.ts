import { UserController } from './user.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.schema.dto';
import { Request } from 'express';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService;

  beforeEach(async () => {
    mockUserService = {
      createUser: jest.fn(),
      getUser: jest.fn(),
      updateUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('createUser', async () => {
    const dto: CreateUserDto = {
      name: 'Иван',
      email: 'test@mail.ru',
      password: '123',
    };

    const response = {
      message: 'Готово.',
    };

    mockUserService.createUser.mockResolvedValue(response);

    const result = await controller.createUser(dto);

    expect(mockUserService.createUser).toHaveBeenCalledWith(dto);
    expect(mockUserService.createUser).toHaveBeenCalledTimes(1);
    expect(result).toEqual(response);
  });

  it('getUser', async () => {
    const user = {
      name: 'Иван',
      email: 'test@mail.ru',
    };

    mockUserService.getUser.mockResolvedValue(user);

    const result = await controller.getUser();

    expect(mockUserService.getUser).toHaveBeenCalledTimes(1);
    expect(result).toEqual(user);
  });

  it('updateUser', async () => {
    const request = {
      cookies: { session_blog_lm: 'token' },
    } as unknown as Request;

    const dto: UpdateUserDto = {
      name: 'Максим',
      email: 'new@mail.ru',
      telegram: '@maks',
    };

    const response = {
      name: 'Максим',
      email: 'new@mail.ru',
      telegram: '@maks',
    };

    mockUserService.updateUser.mockResolvedValue(response);

    const result = await controller.updateUser(dto, request);

    expect(mockUserService.updateUser).toHaveBeenCalledWith(dto, request);
    expect(mockUserService.updateUser).toHaveBeenCalledTimes(1);
    expect(result).toEqual(response);
  });
});
