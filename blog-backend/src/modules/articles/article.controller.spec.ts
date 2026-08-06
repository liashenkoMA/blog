import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ArticleDto } from './article.schema.dto';

describe('ArticleController', () => {
  let controller: ArticleController;
  let mockArticleService;

  beforeEach(async () => {
    mockArticleService = {
      createArticle: jest.fn(),
      getLastArticles: jest.fn(),
      getCategoryArticles: jest.fn(),
      getTagArticles: jest.fn(),
      getAllArticles: jest.fn(),
      getArticle: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [
        {
          provide: ArticleService,
          useValue: mockArticleService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<ArticleController>(ArticleController);
  });

  it('createArticle', async () => {
    const mockArticle: ArticleDto = {
      slug: 'nestjs-backend',
      title: 'NestJS Backend',
      h1: 'Разработка backend на NestJS',
      description:
        'Статья о разработке backend-приложений с использованием NestJS.',
      category: 'category-id',
      tags: ['tag-id-1', 'tag-id-2'],
      image: '/uploads/nestjs.jpg',
      imageAlt: 'NestJS backend',
      content: 'Содержимое статьи',
    };

    const mockResponse = {
      _id: 'article-id',
      ...mockArticle,
    };

    mockArticleService.createArticle.mockResolvedValue(mockResponse);

    const result = await controller.createArticle(mockArticle);

    expect(result).toEqual(mockResponse);
    expect(mockArticleService.createArticle).toHaveBeenCalledWith(mockArticle);
    expect(mockArticleService.createArticle).toHaveBeenCalledTimes(1);
  });

  it('getLastArticles', async () => {
    const mockResponse = [
      {
        _id: 'article-id-1',
        slug: 'nestjs-backend',
        title: 'NestJS Backend',
      },
      {
        _id: 'article-id-2',
        slug: 'nextjs-frontend',
        title: 'Next.js Frontend',
      },
    ];

    mockArticleService.getLastArticles.mockResolvedValue(mockResponse);

    const result = await controller.getLastArticles();

    expect(result).toEqual(mockResponse);
    expect(mockArticleService.getLastArticles).toHaveBeenCalledTimes(1);
  });

  it('getCategoryArticles', async () => {
    const mockSlug = 'backend';
    const mockPage = 1;

    const mockResponse = [
      {
        _id: 'article-id-1',
        slug: 'nestjs-backend',
        title: 'NestJS Backend',
      },
    ];

    mockArticleService.getCategoryArticles.mockResolvedValue(mockResponse);

    const result = await controller.getCategoryArticles(mockSlug, mockPage);

    expect(result).toEqual(mockResponse);
    expect(mockArticleService.getCategoryArticles).toHaveBeenCalledWith(
      mockSlug,
      mockPage,
    );
    expect(mockArticleService.getCategoryArticles).toHaveBeenCalledTimes(1);
  });

  it('getTagArticles', async () => {
    const mockSlug = 'nestjs';
    const mockPage = 1;

    const mockResponse = [
      {
        _id: 'article-id-1',
        slug: 'nestjs-backend',
        title: 'NestJS Backend',
      },
    ];

    mockArticleService.getTagArticles.mockResolvedValue(mockResponse);

    const result = await controller.getTagArticles(mockSlug, mockPage);

    expect(result).toEqual(mockResponse);
    expect(mockArticleService.getTagArticles).toHaveBeenCalledWith(
      mockSlug,
      mockPage,
    );
    expect(mockArticleService.getTagArticles).toHaveBeenCalledTimes(1);
  });

  it('getAllArticles', async () => {
    const mockPage = 1;

    const mockResponse = [
      {
        _id: 'article-id-1',
        slug: 'nestjs-backend',
        title: 'NestJS Backend',
      },
    ];

    mockArticleService.getAllArticles.mockResolvedValue(mockResponse);

    const result = await controller.getAllArticles(mockPage);

    expect(result).toEqual(mockResponse);
    expect(mockArticleService.getAllArticles).toHaveBeenCalledWith(mockPage);
    expect(mockArticleService.getAllArticles).toHaveBeenCalledTimes(1);
  });

  it('getArticle', async () => {
    const mockSlug = 'nestjs-backend';

    const mockResponse = {
      _id: 'article-id',
      slug: 'nestjs-backend',
      title: 'NestJS Backend',
      h1: 'Разработка backend на NestJS',
    };

    mockArticleService.getArticle.mockResolvedValue(mockResponse);

    const result = await controller.getArticle(mockSlug);

    expect(result).toEqual(mockResponse);
    expect(mockArticleService.getArticle).toHaveBeenCalledWith(mockSlug);
    expect(mockArticleService.getArticle).toHaveBeenCalledTimes(1);
  });
});
