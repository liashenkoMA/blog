import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller';
import { FileService } from './file.service';

describe('FileController', () => {
  let controller: FileController;

  const mockFileService = {
    addFile: jest.fn(),
    getFiles: jest.fn(),
    getFile: jest.fn(),
    deleteFile: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [
        {
          provide: FileService,
          useValue: mockFileService,
        },
      ],
    }).compile();

    controller = module.get<FileController>(FileController);
  });

  it('addFile', async () => {
    const mockFile = {
      originalname: 'test.jpg',
      filename: 'test_123.jpg',
      mimetype: 'image/jpeg',
    } as Express.Multer.File;

    const mockResponse = { filePath: '/uploads/test_123.jpg' };

    mockFileService.addFile.mockReturnValue(mockResponse);

    const result = await controller.addFile(mockFile);

    expect(result).toEqual(mockResponse);
    expect(mockFileService.addFile).toHaveBeenCalledTimes(1);
    expect(mockFileService.addFile).toHaveBeenCalledWith(mockFile);
  });

  it('getFiles', async () => {
    const mockFiles = ['image-1.jpg', 'image-2.jpg', 'image-3.jpg'];

    mockFileService.getFiles.mockResolvedValue(mockFiles);

    const result = await controller.getFiles();

    expect(result).toEqual(mockFiles);
    expect(mockFileService.getFiles).toHaveBeenCalledTimes(1);
  });

  it('getFile', async () => {
    const mockFile = 'image-1.jpg';

    const mockResponse = {
      filePath: '/uploads/image-1.jpg',
    };

    mockFileService.getFile.mockResolvedValue(mockResponse);

    const result = await controller.getFile(mockFile);

    expect(result).toEqual(mockResponse);
    expect(mockFileService.getFile).toHaveBeenCalledTimes(1);
    expect(mockFileService.getFile).toHaveBeenCalledWith(mockFile);
  });

  it('deleteFile', async () => {
    const mockFile = 'image-1.jpg';

    const mockResponse = {
      message: 'Файл удалён.',
    };

    mockFileService.deleteFile.mockResolvedValue(mockResponse);

    const result = await controller.deleteFile(mockFile);

    expect(mockFileService.deleteFile).toHaveBeenCalledWith(mockFile);
    expect(mockFileService.deleteFile).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });
});
