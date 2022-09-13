import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { GcpStorageService } from '../gcp-storage/gcp-storage.service';
import { UnlayerController } from './unlayer.controller';
import { UnlayerService } from './unlayer.service';

describe('UnlayerController', () => {
  let controller: UnlayerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnlayerController],
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
        {
          provide: UnlayerService,
          useValue: {
            getCustomJs: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UnlayerController>(UnlayerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
