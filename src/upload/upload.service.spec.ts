import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { GcpStorageService } from '../gcp-storage/gcp-storage.service';
import { UploadService } from './upload.service';
import { PassThrough } from 'stream';

jest.mock('uuid', () => ({ v4: jest.fn() }));
import * as uuid from 'uuid';

jest.mock('sharp', () => jest.fn());
import * as sharp from 'sharp';

describe('UploadService', () => {
  let service: UploadService;
  let gcpService: GcpStorageService;
  let configService: ConfigService;
  let resize, jpeg, mockSharp, stream;

  beforeEach(async () => {
    stream = new PassThrough();
    mockSharp = jest.fn(() => ({ resize }));
    resize = jest.fn(() => ({ jpeg }));
    jpeg = jest.fn(() => stream);

    sharp.mockImplementation(mockSharp);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: ConfigService,
          useValue: {
            get: () => ({ resizeTo: 800 }),
          },
        },
        {
          provide: GcpStorageService,
          useValue: {
            uploadFromStream: jest.fn(() => ({
              url: '',
            })),
          },
        },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
    gcpService = module.get<GcpStorageService>(GcpStorageService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should resize a file and pass it to gcp service', async () => {
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

    const companyId = 'test-company-id';
    const testUuid = 'test-uuid';

    uuid.v4.mockReturnValue(testUuid);
    const uploadPath = `${companyId}/uploaded-image/${testUuid}.jpg`;

    await service.uploadImage(companyId, file);
    expect(mockSharp).toHaveBeenCalledWith(file.path);
    expect(resize).toHaveBeenCalledWith(configService.get('').resizeTo);
    expect(jpeg).toHaveBeenCalledWith({ quality: 80 });

    expect(gcpService.uploadFromStream).toHaveBeenCalledWith(
      stream,
      uploadPath,
      file.mimetype,
    );
  });
});
