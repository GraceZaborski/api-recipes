import { Test, TestingModule } from '@nestjs/testing';
import { PassThrough } from 'stream';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

describe('UploadController', () => {
  let controller: UploadController;
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: UploadService,
          useValue: {
            uploadImage: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UploadController>(UploadController);
    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be able to upload an image', async () => {
    const file: Express.Multer.File = {
      fieldname: 'image',
      originalname: 'image.png',
      encoding: 'BINARY',
      mimetype: 'image/png',
      size: 123,
      stream: new PassThrough(),
      destination: '/tmp',
      filename: 'image.png',
      path: '/tmp/image/png',
      buffer: Buffer.from(''),
    };

    await controller.uploadImage({ companyId: 'test' }, file);
    expect(service.uploadImage).toHaveBeenCalledWith('test', file);
  });

  it('should handle non images', async () => {
    const file = null;

    await expect(
      controller.uploadImage({ companyId: 'test' }, file),
    ).rejects.toThrow();
  });
});
