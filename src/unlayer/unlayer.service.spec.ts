import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { GcpStorageService } from '../gcp-storage/gcp-storage.service';
import { UnlayerService } from './unlayer.service';

describe('UnlayerService', () => {
  let service: UnlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: GcpStorageService,
          useValue: {
            streamFromUrl: jest.fn(() => ({
              url: '',
            })),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => ({
              apiUrl: '',
              apiKey: '',
              previewImage: {},
            })),
          },
        },
        UnlayerService,
      ],
    }).compile();

    service = module.get<UnlayerService>(UnlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
