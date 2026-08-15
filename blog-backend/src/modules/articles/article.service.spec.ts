import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { ArticleService } from './article.service';
import { Article, ArticleStatus } from './article.schema';
import { ArticleDto, ArticleListResponseDto } from './article.schema.dto';
import { Category } from '../categories/categories.schema';
import { Tag } from '../tags/tags.schema';
import { Types } from 'mongoose';

describe('ArticleService', () => {
  let service: ArticleService;
  let mockArticleModel;
  let mockCategoryModel;
  let mockTagModel;

  beforeEach(async () => {
    jest.resetAllMocks();

    mockArticleModel = jest.fn();
    mockArticleModel.find = jest.fn();
    mockArticleModel.findOne = jest.fn();
    mockArticleModel.create = jest.fn();
    mockArticleModel.countDocuments = jest.fn();

    mockCategoryModel = jest.fn();
    mockCategoryModel.findOne = jest.fn();

    mockTagModel = jest.fn();
    mockTagModel.findOne = jest.fn();

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

      await expect(service.getCategoryArticles(mockSlug, 1)).rejects.toThrow(
        NotFoundException,
      );
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

      await expect(service.getTagArticles(mockSlug, 1)).rejects.toThrow(
        NotFoundException,
      );
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

      await expect(service.getAllArticles(1)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockArticleModel.find).toHaveBeenCalledWith({
        status: ArticleStatus.PUBLISHED,
      });
      expect(mockArticleModel.find).toHaveBeenCalledTimes(1);
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
    });
  });
});
