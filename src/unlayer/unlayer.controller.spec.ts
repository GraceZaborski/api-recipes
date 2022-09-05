import { Test, TestingModule } from '@nestjs/testing';
import { UnlayerController } from './unlayer.controller';
import { UnlayerService } from './unlayer.service';

describe('UnlayerController', () => {
  let controller: UnlayerController;
  let service: UnlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnlayerController],
      providers: [
        {
          provide: UnlayerService,
          useValue: {
            generatePreviewImage: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UnlayerController>(UnlayerController);
    service = module.get<UnlayerService>(UnlayerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call the unlayer service', async () => {
    const design = { json: { foo: 'bar' } };
    const auth = { companyId: 'test' };
    await controller.exportImage(design, auth);

    expect(service.generatePreviewImage).toHaveBeenCalledWith(
      design,
      auth.companyId,
    );
  });
});
