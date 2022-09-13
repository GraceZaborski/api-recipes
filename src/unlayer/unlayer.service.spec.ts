import { Test, TestingModule } from '@nestjs/testing';
import { CampaignsService } from '../campaigns/campaigns.service';
import { CompaniesService } from '../companies/companies.service';
import { UserService } from '../user/user.service';
import { UnlayerService } from './unlayer.service';

describe('UnlayerService', () => {
  let service: UnlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnlayerService,
        {
          provide: CompaniesService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: CampaignsService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUser: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<UnlayerService>(UnlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
