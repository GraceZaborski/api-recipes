import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { GcpStorageService } from '../gcp-storage/gcp-storage.service';
import { UploadService } from './upload.service';

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => ({
              uploads: {
                image: {
                  resizeTo: 800,
                },
              },
            })),
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
