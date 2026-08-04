import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { TagsController } from './tags.controller';
import { TagDto } from './tags.schema.dto';
import { TagsService } from './tags.service';

describe('TagsController', () => {
  let controller: TagsController;
  let mockTagsService;

  beforeEach(async () => {
    mockTagsService = {
      postTag: jest.fn(),
      getTag: jest.fn(),
      getTags: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [{ provide: TagsService, useValue: mockTagsService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<TagsController>(TagsController);
  });

  it('postTag', async () => {
    const mockCreateTag: TagDto = {
      slug: 'backend',
      name: 'Backend',
      image: '/images/tag/backend.jpg',
      imageAlt: 'Backend разработка',
      title: 'Backend разработка',
      description:
        'Статьи о backend-разработке, NestJS, MongoDB и серверной архитектуре.',
    };

    const mockResponse = {
      _id: 'tag-id',
      slug: 'backend',
      name: 'Backend',
      image: '/images/tag/backend.jpg',
      imageAlt: 'Backend разработка',
      title: 'Backend разработка',
      description:
        'Статьи о backend-разработке, NestJS, MongoDB и серверной архитектуре.',
    };

    mockTagsService.postTag.mockResolvedValue(mockResponse);

    const result = await controller.postTag(mockCreateTag);

    expect(result).toEqual(mockResponse);
    expect(mockTagsService.postTag).toHaveBeenCalledWith(mockCreateTag);
    expect(mockTagsService.postTag).toHaveBeenCalledTimes(1);
  });

  it('getTag', async () => {
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

    mockTagsService.getTag.mockResolvedValue(mockResponse);

    const result = await controller.getTag(mockSlug);

    expect(result).toEqual(mockResponse);
    expect(mockTagsService.getTag).toHaveBeenCalledWith(mockSlug);
    expect(mockTagsService.getTag).toHaveBeenCalledTimes(1);
  });

  it('getTags', async () => {
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

    mockTagsService.getTags.mockResolvedValue(mockResponse);

    const result = await controller.getTags();

    expect(result).toEqual(mockResponse);
    expect(mockTagsService.getTags).toHaveBeenCalledTimes(1);
  });
});
