import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { ArticleService } from './article.service';
import { Article, ArticleStatus } from './article.schema';
import { ArticleDto, ArticleListResponseDto } from './article.schema.dto';
import { Category } from '../categories/categories.schema';
import { Tag } from '../tags/tags.schema';
import { Types } from 'mongoose';
import { REDIS_CLIENT } from '../../shared/constants/redis.constants';

describe('ArticleService', () => {
  let service: ArticleService;
  let mockArticleModel;
  let mockCategoryModel;
  let mockTagModel;
  let mockRedisClient;

  beforeEach(async () => {
    jest.resetAllMocks();

    mockArticleModel = jest.fn();
    mockArticleModel.find = jest.fn();
    mockArticleModel.findOne = jest.fn();
    mockArticleModel.create = jest.fn();
    mockArticleModel.countDocuments = jest.fn();

    mockCategoryModel = jest.fn();
    mockCategoryModel.findOne = jest.fn();
    mockCategoryModel.findById = jest.fn();

    mockTagModel = jest.fn();
    mockTagModel.findOne = jest.fn();
    mockTagModel.find = jest.fn();

    mockRedisClient = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue('OK'),
      del: jest.fn().mockResolvedValue(1),
      scanIterator: jest.fn().mockReturnValue(
        (async function* () {
          yield [];
        })(),
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: getModelToken(Article.name),
          useValue: mockArticleModel,
        },
        {
          provide: getModelToken(Category.name),
          useValue: mockCategoryModel,
        },
        {
          provide: getModelToken(Tag.name),
          useValue: mockTagModel,
        },
        {
          provide: REDIS_CLIENT,
          useValue: mockRedisClient,
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
  });

  describe('createArticle', () => {
    it('Успешное создание статьи', async () => {
      const mockArticle: ArticleDto = {
        slug: 'nestjs',
        title: 'NestJS',
        h1: 'Разработка на NestJS',
        description: 'Статья о NestJS',
        category: 'category-id',
        tags: ['tag-id-1', 'tag-id-2'],
        image: '/images/nestjs.jpg',
        imageAlt: 'NestJS',
        content:
          'NestJS позволяет создавать серверные приложения на TypeScript.',
      };

      const mockCategory = {
        _id: 'category-id',
        slug: 'backend',
      };

      const mockTags = [
        {
          _id: 'tag-id-1',
          slug: 'nestjs',
        },
        {
          _id: 'tag-id-2',
          slug: 'typescript',
        },
      ];

      mockCategoryModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCategory),
      });

      mockTagModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTags),
      });

      mockArticleModel.create.mockResolvedValue({});

      const result = await service.createArticle(mockArticle);

      expect(result).toEqual({
        message: 'Статья успешно создана',
      });
      expect(mockArticleModel.create).toHaveBeenCalledWith({
        ...mockArticle,
        readingTime: 1,
        tags: ['tag-id-1', 'tag-id-2'],
      });
      expect(mockArticleModel.create).toHaveBeenCalledTimes(1);
      expect(mockRedisClient.del).toHaveBeenCalledWith('articles:last');
      expect(mockRedisClient.scanIterator).toHaveBeenCalledWith({
        MATCH: 'articles:page:*',
      });
      expect(mockRedisClient.scanIterator).toHaveBeenCalledWith({
        MATCH: 'category:backend:page:*',
      });
      expect(mockRedisClient.scanIterator).toHaveBeenCalledWith({
        MATCH: 'tag:nestjs:page:*',
      });
      expect(mockRedisClient.scanIterator).toHaveBeenCalledWith({
        MATCH: 'tag:typescript:page:*',
      });
    });
  });

  describe('getLastArticles', () => {
    it('Опубликованных статей нет', async () => {
      mockArticleModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      });

      await expect(service.getLastArticles()).rejects.toThrow(
        NotFoundException,
      );

      expect(mockArticleModel.find).toHaveBeenCalledWith({
        status: ArticleStatus.PUBLISHED,
      });
      expect(mockArticleModel.find).toHaveBeenCalledTimes(1);
    });

    it('Успешное получение последних статей', async () => {
      const mockResponse: ArticleListResponseDto[] = [
        {
          _id: new Types.ObjectId(),
          slug: 'nestjs',
          title: 'NestJS',
          h1: 'Разработка на NestJS',
          description: 'Статья о NestJS',
          category: {
            _id: new Types.ObjectId(),
            slug: 'backend',
            name: 'Backend',
            title: 'Backend',
            description: 'Backend разработка',
            image: '/images/backend.jpg',
            imageAlt: 'Backend',
          },
          tags: [],
          image: '/images/nestjs.jpg',
          imageAlt: 'NestJS',
          readingTime: 1,
          status: ArticleStatus.PUBLISHED,
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockArticleModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await service.getLastArticles();

      expect(result).toEqual(mockResponse);
      expect(mockArticleModel.find).toHaveBeenCalledWith({
        status: ArticleStatus.PUBLISHED,
      });
      expect(mockArticleModel.find).toHaveBeenCalledTimes(1);
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'articles:last',
        JSON.stringify(mockResponse),
        { EX: 3600 },
      );
    });

    it('Получение последних статей из кэша', async () => {
      const mockResponse = [];

      mockRedisClient.get.mockResolvedValue(JSON.stringify(mockResponse));

      const result = await service.getLastArticles();

      expect(result).toEqual(mockResponse);
      expect(mockRedisClient.get).toHaveBeenCalledWith('articles:last');
      expect(mockArticleModel.find).not.toHaveBeenCalled();
      expect(mockRedisClient.set).not.toHaveBeenCalled();
    });
  });

  describe('getCategoryArticles', () => {
    it('Категория не существует', async () => {
      const mockSlug = 'backend';

      mockCategoryModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getCategoryArticles(mockSlug, 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCategoryModel.findOne).toHaveBeenCalledWith({
        slug: mockSlug,
      });
      expect(mockCategoryModel.findOne).toHaveBeenCalledTimes(1);
    });

    it('Статьи категории не найдены', async () => {
      const mockSlug = 'backend';

      const mockCategory = {
        _id: 'category-id',
        slug: mockSlug,
      };

      mockCategoryModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCategory),
      });

      mockArticleModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      });

      mockArticleModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(0),
      });

      const result = await service.getCategoryArticles(mockSlug, 1);

      expect(result).toEqual({ articles: [], totalCount: 0 });
    });

    it('Успешное получение статей категории', async () => {
      const mockSlug = 'backend';

      const mockResponse: ArticleListResponseDto[] = [
        {
          _id: new Types.ObjectId(),
          slug: 'nestjs',
          title: 'NestJS',
          h1: 'Разработка на NestJS',
          description: 'Статья о NestJS',
          category: {
            _id: new Types.ObjectId(),
            slug: 'backend',
            name: 'Backend',
            title: 'Backend',
            description: 'Backend разработка',
            image: '/images/backend.jpg',
            imageAlt: 'Backend',
          },
          tags: [],
          image: '/images/nestjs.jpg',
          imageAlt: 'NestJS',
          readingTime: 1,
          status: ArticleStatus.PUBLISHED,
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockCategoryModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'category-id',
          slug: mockSlug,
        }),
      });

      mockArticleModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockResponse),
      });

      mockArticleModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });

      const result = await service.getCategoryArticles(mockSlug, 1);

      expect(result).toEqual({
        articles: mockResponse,
        totalCount: 1,
      });
      expect(mockArticleModel.find).toHaveBeenCalledWith({
        category: 'category-id',
        status: ArticleStatus.PUBLISHED,
      });
      expect(mockArticleModel.countDocuments).toHaveBeenCalledWith({
        category: 'category-id',
        status: ArticleStatus.PUBLISHED,
      });
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'category:backend:page:1',
        JSON.stringify({
          articles: mockResponse,
          totalCount: 1,
        }),
        { EX: 3600 },
      );
    });

    it('Получение статей категории из кэша', async () => {
      const mockSlug = 'backend';

      const mockResponse = {
        articles: [],
        totalCount: 10,
      };

      mockRedisClient.get.mockResolvedValue(JSON.stringify(mockResponse));

      const result = await service.getCategoryArticles(mockSlug, 2);

      expect(result).toEqual(mockResponse);
      expect(mockRedisClient.get).toHaveBeenCalledWith(
        'category:backend:page:2',
      );
      expect(mockCategoryModel.findOne).not.toHaveBeenCalled();
      expect(mockArticleModel.find).not.toHaveBeenCalled();
      expect(mockArticleModel.countDocuments).not.toHaveBeenCalled();
      expect(mockRedisClient.set).not.toHaveBeenCalled();
    });
  });

  describe('getTagArticles', () => {
    it('Тэг не существует', async () => {
      const mockSlug = 'nestjs';

      mockTagModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getTagArticles(mockSlug, 1)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockTagModel.findOne).toHaveBeenCalledWith({
        slug: mockSlug,
      });
      expect(mockTagModel.findOne).toHaveBeenCalledTimes(1);
    });

    it('Статьи тэга не найдены', async () => {
      const mockSlug = 'nestjs';

      const mockTag = {
        _id: 'tag-id',
        slug: mockSlug,
      };

      mockTagModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTag),
      });

      mockArticleModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      });

      mockArticleModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(0),
      });

      const result = await service.getTagArticles(mockSlug, 1);

      expect(result).toEqual({ articles: [], totalCount: 0 });
    });

    it('Успешное получение статей тэга', async () => {
      const mockSlug = 'nestjs';

      const mockResponse: ArticleListResponseDto[] = [
        {
          _id: new Types.ObjectId(),
          slug: 'nestjs',
          title: 'NestJS',
          h1: 'Разработка на NestJS',
          description: 'Статья о NestJS',
          category: {
            _id: new Types.ObjectId(),
            slug: 'backend',
            name: 'Backend',
            title: 'Backend',
            description: 'Backend разработка',
            image: '/images/backend.jpg',
            imageAlt: 'Backend',
          },
          tags: [],
          image: '/images/nestjs.jpg',
          imageAlt: 'NestJS',
          readingTime: 1,
          status: ArticleStatus.PUBLISHED,
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockTagModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: 'tag-id',
          slug: mockSlug,
        }),
      });

      mockArticleModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockResponse),
      });

      mockArticleModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });

      const result = await service.getTagArticles(mockSlug, 1);

      expect(result).toEqual({
        articles: mockResponse,
        totalCount: 1,
      });
      expect(mockArticleModel.find).toHaveBeenCalledWith({
        tags: 'tag-id',
        status: ArticleStatus.PUBLISHED,
      });
      expect(mockArticleModel.countDocuments).toHaveBeenCalledWith({
        tags: 'tag-id',
        status: ArticleStatus.PUBLISHED,
      });
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'tag:nestjs:page:1',
        JSON.stringify({
          articles: mockResponse,
          totalCount: 1,
        }),
        { EX: 3600 },
      );
    });

    it('Получение статей тэга из кэша', async () => {
      const mockSlug = 'nestjs';

      const mockResponse = {
        articles: [],
        totalCount: 10,
      };

      mockRedisClient.get.mockResolvedValue(JSON.stringify(mockResponse));

      const result = await service.getTagArticles(mockSlug, 2);

      expect(result).toEqual(mockResponse);
      expect(mockRedisClient.get).toHaveBeenCalledWith('tag:nestjs:page:2');
      expect(mockTagModel.findOne).not.toHaveBeenCalled();
      expect(mockArticleModel.find).not.toHaveBeenCalled();
      expect(mockArticleModel.countDocuments).not.toHaveBeenCalled();
      expect(mockRedisClient.set).not.toHaveBeenCalled();
    });
  });

  describe('getAllArticles', () => {
    it('Опубликованных статей нет', async () => {
      mockArticleModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      });

      mockArticleModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(0),
      });

      const result = await service.getAllArticles(1);

      expect(result).toEqual({
        articles: [],
        totalCount: 0,
      });
      expect(mockArticleModel.find).toHaveBeenCalledWith({
        status: ArticleStatus.PUBLISHED,
      });
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'articles:page:1',
        JSON.stringify({
          articles: [],
          totalCount: 0,
        }),
        { EX: 3600 },
      );
    });

    it('Успешное получение всех статей', async () => {
      const mockResponse: ArticleListResponseDto[] = [
        {
          _id: new Types.ObjectId(),
          slug: 'nestjs',
          title: 'NestJS',
          h1: 'Разработка на NestJS',
          description: 'Статья о NestJS',
          category: {
            _id: new Types.ObjectId(),
            slug: 'backend',
            name: 'Backend',
            title: 'Backend',
            description: 'Backend разработка',
            image: '/images/backend.jpg',
            imageAlt: 'Backend',
          },
          tags: [],
          image: '/images/nestjs.jpg',
          imageAlt: 'NestJS',
          readingTime: 1,
          status: ArticleStatus.PUBLISHED,
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockArticleModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockResponse),
      });

      mockArticleModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });

      const result = await service.getAllArticles(1);

      expect(result).toEqual({
        articles: mockResponse,
        totalCount: 1,
      });
      expect(mockArticleModel.find).toHaveBeenCalledWith({
        status: ArticleStatus.PUBLISHED,
      });
      expect(mockArticleModel.countDocuments).toHaveBeenCalledWith({
        status: ArticleStatus.PUBLISHED,
      });
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'articles:page:1',
        JSON.stringify({
          articles: mockResponse,
          totalCount: 1,
        }),
        { EX: 3600 },
      );
    });

    it('Получение списка статей из кэша', async () => {
      const mockResponse = {
        articles: [],
        totalCount: 10,
      };

      mockRedisClient.get.mockResolvedValue(JSON.stringify(mockResponse));

      const result = await service.getAllArticles(2);

      expect(result).toEqual(mockResponse);
      expect(mockRedisClient.get).toHaveBeenCalledWith('articles:page:2');
      expect(mockArticleModel.find).not.toHaveBeenCalled();
      expect(mockArticleModel.countDocuments).not.toHaveBeenCalled();
      expect(mockRedisClient.set).not.toHaveBeenCalled();
    });
  });

  describe('getArticle', () => {
    it('Статья не существует', async () => {
      const mockSlug = 'nestjs';

      mockArticleModel.findOne.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getArticle(mockSlug)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockArticleModel.findOne).toHaveBeenCalledWith({
        slug: mockSlug,
        status: ArticleStatus.PUBLISHED,
      });
      expect(mockArticleModel.findOne).toHaveBeenCalledTimes(1);
    });

    it('Успешное получение статьи', async () => {
      const mockSlug = 'nestjs';

      const mockResponse = {
        _id: 'article-id',
        slug: mockSlug,
        title: 'NestJS',
        h1: 'Разработка на NestJS',
        description: 'Статья о NestJS',
        category: {
          _id: 'category-id',
          slug: 'backend',
          name: 'Backend',
          title: 'Backend',
          description: 'Backend разработка',
          image: '/images/backend.jpg',
          imageAlt: 'Backend',
        },
        tags: [],
        image: '/images/nestjs.jpg',
        imageAlt: 'NestJS',
        content: 'Текст статьи',
        readingTime: 1,
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockArticleModel.findOne.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await service.getArticle(mockSlug);

      expect(result).toEqual(mockResponse);
      expect(mockArticleModel.findOne).toHaveBeenCalledWith({
        slug: mockSlug,
        status: ArticleStatus.PUBLISHED,
      });
      expect(mockArticleModel.findOne).toHaveBeenCalledTimes(1);
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'article:nestjs',
        JSON.stringify(mockResponse),
        { EX: 3600 },
      );
    });

    it('Получение статьи из кэша', async () => {
      const mockSlug = 'nestjs';

      const mockResponse = {
        _id: 'article-id',
        slug: mockSlug,
        title: 'NestJS',
        h1: 'Разработка на NestJS',
        description: 'Статья о NestJS',
        category: {
          _id: 'category-id',
          slug: 'backend',
          name: 'Backend',
          title: 'Backend',
          description: 'Backend разработка',
          image: '/images/backend.jpg',
          imageAlt: 'Backend',
        },
        tags: [],
        image: '/images/nestjs.jpg',
        imageAlt: 'NestJS',
        content: 'Текст статьи',
        readingTime: 1,
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const cachedResponse = JSON.stringify(mockResponse);

      mockRedisClient.get.mockResolvedValue(cachedResponse);

      const result = await service.getArticle(mockSlug);

      expect(result).toEqual(JSON.parse(cachedResponse));
      expect(mockRedisClient.get).toHaveBeenCalledWith('article:nestjs');
      expect(mockArticleModel.findOne).not.toHaveBeenCalled();
      expect(mockRedisClient.set).not.toHaveBeenCalled();
    });
  });
});
