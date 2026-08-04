import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './categories.schema.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let mockCategoryModel;

  beforeEach(async () => {
    jest.resetAllMocks();

    mockCategoryModel = jest.fn();
    mockCategoryModel.find = jest.fn();
    mockCategoryModel.findOne = jest.fn();
    mockCategoryModel.create = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: 'CategoryModel',
          useValue: mockCategoryModel,
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
    it('Успешное получение всех категорий', async () => {
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
      expect(mockCategoryModel.find).toHaveBeenCalledTimes(1);
    });
  });
});
