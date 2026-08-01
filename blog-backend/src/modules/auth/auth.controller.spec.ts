import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('Успешное выполнение запроса', async () => {
    const dto = {
      email: 'test@mail.com',
      password: '1234',
    };

    const mockResult = {
      access_token: 'jwt_token',
    };

    mockAuthService.signIn.mockResolvedValue(mockResult);

    const result = await controller.signIn(dto);

    expect(mockAuthService.signIn).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockResult);
  });

  it('Ошибка UnauthorizedException', async () => {
    const dto = {
      email: 'test@mail.com',
      password: 'wrong',
    };

    mockAuthService.signIn.mockRejectedValue(new UnauthorizedException());

    await expect(controller.signIn(dto)).rejects.toThrow(UnauthorizedException);
  });

  it('Ошибка NotFoundException', async () => {
    const dto = {
      email: 'unknown@mail.com',
      password: '1234',
    };

    mockAuthService.signIn.mockRejectedValue(new NotFoundException());

    await expect(controller.signIn(dto)).rejects.toThrow(NotFoundException);
  });
});
