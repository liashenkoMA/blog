import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { promises as fs } from 'fs';

jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(),
    stat: jest.fn(),
    unlink: jest.fn(),
  },
}));

describe('FileService', () => {
  let service: FileService;
  const mockFs = fs as jest.Mocked<typeof fs>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('addFile', async () => {
    const mockFile = {
      filename: 'test.jpg',
    } as Express.Multer.File;

    const filePath = {
      filePath: `${process.env.URL_UPLOADIMG}/files/test.jpg`,
    };

    const result = await service.addFile(mockFile);

    expect(result).toEqual(filePath);
  });

  it('getFiles', async () => {
    const mockFiles = ['image-1.jpg', 'image-2.png'];

    const filePaths = [
      {
        filePath: `${process.env.URL_UPLOADIMG}/files/image-1.jpg`,
      },
      {
        filePath: `${process.env.URL_UPLOADIMG}/files/image-2.png`,
      },
    ];

    mockFs.readdir.mockResolvedValue(mockFiles as any);

    const result = await service.getFiles();

    expect(mockFs.readdir).toHaveBeenCalledTimes(1);
    expect(result).toEqual(filePaths);
  });

  it('getFile', async () => {
    const filename = 'image-1.jpg';

    mockFs.stat.mockResolvedValue({} as any);

    const result = await service.getFile(filename);

    expect(mockFs.stat).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      filePath: `${process.env.URL_UPLOADIMG}/files/image-1.jpg`,
    });
  });

  it('deleteFile', async () => {
    const filename = 'image-1.jpg';

    const message = {
      message: 'Файл удалён.',
    };

    mockFs.unlink.mockResolvedValue(undefined);

    const result = await service.deleteFile(filename);

    expect(mockFs.unlink).toHaveBeenCalledTimes(1);
    expect(result).toEqual(message);
  });
});
