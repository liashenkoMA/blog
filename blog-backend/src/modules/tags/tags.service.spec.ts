import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagDto } from './tags.schema.dto';
import { getModelToken } from '@nestjs/mongoose';
import { Tag } from './tags.schema';

describe('TagsService', () => {
  let service: TagsService;
  let mockTagModel;

  beforeEach(async () => {
    jest.resetAllMocks();

    mockTagModel = jest.fn();
    mockTagModel.find = jest.fn();
    mockTagModel.findOne = jest.fn();
    mockTagModel.create = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: getModelToken(Tag.name),
          useValue: mockTagModel,
        },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
  });

  describe('postTag', () => {
    it('Успешное создание тэга', async () => {
      const mockTag: TagDto = {
        slug: 'backend',
        name: 'Backend',
        image: '/images/tags/backend.jpg',
        imageAlt: 'Backend разработка',
        title: 'Backend разработка',
        description:
          'Статьи о backend-разработке, NestJS, MongoDB и серверной архитектуре.',
      };

      const mockResponse = {
        _id: 'tag-id',
        ...mockTag,
      };

      mockTagModel.create.mockResolvedValue(mockResponse);

      const result = await service.postTag(mockTag);

      expect(result).toEqual({
        createTag: mockResponse,
      });
      expect(mockTagModel.create).toHaveBeenCalledWith(mockTag);
      expect(mockTagModel.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTag', () => {
    it('Тэга не существует', async () => {
      const mockSlug = 'backend';

      mockTagModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getTag(mockSlug)).rejects.toThrow(NotFoundException);
      expect(mockTagModel.findOne).toHaveBeenCalledWith({
        slug: mockSlug,
      });
      expect(mockTagModel.findOne).toHaveBeenCalledTimes(1);
    });

    it('Успешное получение тэга', async () => {
      const mockSlug = 'backend';

      const mockResponse = {
        _id: 'tag-id',
        slug: 'backend',
        name: 'Backend',
        image: '/images/tags/backend.jpg',
        imageAlt: 'Backend разработка',
        title: 'Backend разработка',
        description:
          'Статьи о backend-разработке, NestJS, MongoDB и серверной архитектуре.',
      };

      mockTagModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await service.getTag(mockSlug);

      expect(result).toEqual(mockResponse);
      expect(mockTagModel.findOne).toHaveBeenCalledWith({
        slug: mockSlug,
      });
      expect(mockTagModel.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTags', () => {
    it('Успешное получение всех тэгов', async () => {
      const mockResponse = [
        {
          _id: 'tag-id-1',
          slug: 'backend',
          name: 'Backend',
          image: '/images/tags/backend.jpg',
          imageAlt: 'Backend разработка',
          title: 'Backend разработка',
          description:
            'Статьи о backend-разработке, NestJS, MongoDB и серверной архитектуре.',
        },
        {
          _id: 'tag-id-2',
          slug: 'frontend',
          name: 'Frontend',
          image: '/images/tags/frontend.jpg',
          imageAlt: 'Frontend разработка',
          title: 'Frontend разработка',
          description:
            'Статьи о frontend-разработке, React, Next.js и TypeScript.',
        },
      ];

      mockTagModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await service.getTags();

      expect(result).toEqual(mockResponse);
      expect(mockTagModel.find).toHaveBeenCalledTimes(1);
    });
  });
});
