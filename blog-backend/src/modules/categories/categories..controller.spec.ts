import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './categories.schema.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let mockCategoriesService;

  beforeEach(async () => {
    mockCategoriesService = {
      postCategory: jest.fn(),
      getCategory: jest.fn(),
      getCategories: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        { provide: CategoriesService, useValue: mockCategoriesService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('postCategory', async () => {
    const mockCreateCategory: CategoryDto = {
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
      slug: 'backend',
      name: 'Backend',
      image: '/images/categories/backend.jpg',
      imageAlt: 'Backend разработка',
      title: 'Backend разработка',
      description:
        'Статьи о backend-разработке, NestJS, MongoDB и серверной архитектуре.',
    };

    mockCategoriesService.postCategory.mockResolvedValue(mockResponse);

    const result = await controller.postCategory(mockCreateCategory);

    expect(result).toEqual(mockResponse);
    expect(mockCategoriesService.postCategory).toHaveBeenCalledWith(
      mockCreateCategory,
    );
    expect(mockCategoriesService.postCategory).toHaveBeenCalledTimes(1);
  });

  it('getCategory', async () => {
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

    mockCategoriesService.getCategory.mockResolvedValue(mockResponse);

    const result = await controller.getCategory(mockSlug);

    expect(result).toEqual(mockResponse);
    expect(mockCategoriesService.getCategory).toHaveBeenCalledWith(mockSlug);
    expect(mockCategoriesService.getCategory).toHaveBeenCalledTimes(1);
  });

  it('getCategories', async () => {
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

    mockCategoriesService.getCategories.mockResolvedValue(mockResponse);

    const result = await controller.getCategories();

    expect(result).toEqual(mockResponse);
    expect(mockCategoriesService.getCategories).toHaveBeenCalledTimes(1);
  });
});
