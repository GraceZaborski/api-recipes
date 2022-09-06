import { Test, TestingModule } from '@nestjs/testing';
import { UnlayerService } from './unlayer.service';

describe('UnlayerService', () => {
  let service: UnlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnlayerService],
    }).compile();

    service = module.get<UnlayerService>(UnlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
