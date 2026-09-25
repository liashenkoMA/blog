import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './categories.schema.dto';
import { getModelToken } from '@nestjs/mongoose';
import { Category } from './categories.schema';
import { REDIS_CLIENT } from '../../shared/constants/redis.constants';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let mockCategoryModel;
  let mockRedisClient;

  beforeEach(async () => {
    jest.resetAllMocks();

    mockCategoryModel = jest.fn();
    mockCategoryModel.find = jest.fn();
    mockCategoryModel.findOne = jest.fn();
    mockCategoryModel.create = jest.fn();

    mockRedisClient = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue('OK'),
      del: jest.fn().mockResolvedValue(1),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getModelToken(Category.name),
          useValue: mockCategoryModel,
        },
        {
          provide: REDIS_CLIENT,
          useValue: mockRedisClient,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  describe('postCategory', () => {
    it('Успешное создание категории', async () => {
      const mockCategory: CategoryDto = {
        slug: 'backend',
        name: 'Backend',
        image: '/images/categories/backend.jpg',
        imageAlt: 'Backend разработка',
        title: 'Backend разработка',
        description:
          'Статьи о backend-разработке, NestJS, MongoDB и серверной архитектуре.',
      };

      const mockResponse = {
        _id: 'category-id',
        ...mockCategory,
      };

      mockCategoryModel.create.mockResolvedValue(mockResponse);

      const result = await service.postCategory(mockCategory);

      expect(result).toEqual({
        createCategory: mockResponse,
      });
      expect(mockCategoryModel.create).toHaveBeenCalledWith(mockCategory);
      expect(mockCategoryModel.create).toHaveBeenCalledTimes(1);
      expect(mockRedisClient.del).toHaveBeenCalledWith('categories:all');
      expect(mockRedisClient.del).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCategory', () => {
    it('Категории не существует', async () => {
      const mockSlug = 'backend';

      mockCategoryModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getCategory(mockSlug)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCategoryModel.findOne).toHaveBeenCalledWith({
        slug: mockSlug,
      });
      expect(mockCategoryModel.findOne).toHaveBeenCalledTimes(1);
    });

    it('Успешное получение категории', async () => {
      const mockSlug = 'backend';

      const mockResponse = {
        _id: 'category-id',
        slug: 'backend',
        name: 'Backend',
        image: '/images/categories/backend.jpg',
        imageAlt: 'Backend разработка',
        title: 'Backend разработка',
        description:
          'Статьи о backend-разработке, NestJS, MongoDB и серверной архитектуре.',
      };

      mockCategoryModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await service.getCategory(mockSlug);

      expect(result).toEqual(mockResponse);
      expect(mockCategoryModel.findOne).toHaveBeenCalledWith({
        slug: mockSlug,
      });
      expect(mockCategoryModel.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCategories', () => {
    it('Успешное получение всех категорий из MongoDB и сохранение в кэш', async () => {
      const mockResponse = [
        {
          _id: 'category-id-1',
          slug: 'backend',
          name: 'Backend',
          image: '/images/categories/backend.jpg',
          imageAlt: 'Backend разработка',
          title: 'Backend разработка',
          description:
            'Статьи о backend-разработке, NestJS, MongoDB и серверной архитектуре.',
        },
        {
          _id: 'category-id-2',
          slug: 'frontend',
          name: 'Frontend',
          image: '/images/categories/frontend.jpg',
          imageAlt: 'Frontend разработка',
          title: 'Frontend разработка',
          description:
            'Статьи о frontend-разработке, React, Next.js и TypeScript.',
        },
      ];

      mockCategoryModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await service.getCategories();

      expect(result).toEqual(mockResponse);
      expect(mockRedisClient.get).toHaveBeenCalledWith('categories:all');
      expect(mockCategoryModel.find).toHaveBeenCalledTimes(1);
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'categories:all',
        JSON.stringify(mockResponse),
        {
          EX: 3600,
        },
      );
      expect(mockRedisClient.set).toHaveBeenCalledTimes(1);
    });

    it('Успешное получение всех категорий из кэша', async () => {
      const mockResponse = [
        {
          _id: 'category-id-1',
          slug: 'backend',
          name: 'Backend',
          image: '/images/categories/backend.jpg',
          imageAlt: 'Backend разработка',
          title: 'Backend разработка',
          description:
            'Статьи о backend-разработке, NestJS, MongoDB и серверной архитектуре.',
        },
        {
          _id: 'category-id-2',
          slug: 'frontend',
          name: 'Frontend',
          image: '/images/categories/frontend.jpg',
          imageAlt: 'Frontend разработка',
          title: 'Frontend разработка',
          description:
            'Статьи о frontend-разработке, React, Next.js и TypeScript.',
        },
      ];

      const cachedResponse = JSON.stringify(mockResponse);

      mockRedisClient.get.mockResolvedValue(cachedResponse);

      const result = await service.getCategories();

      expect(result).toEqual(JSON.parse(cachedResponse));
      expect(mockRedisClient.get).toHaveBeenCalledWith('categories:all');
      expect(mockCategoryModel.find).not.toHaveBeenCalled();
      expect(mockRedisClient.set).not.toHaveBeenCalled();
    });
  });
});
