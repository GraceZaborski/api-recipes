import { Test, TestingModule } from '@nestjs/testing';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { UserService } from '../user/user.service';
import { Logger } from '../logger';

describe('CampaignsController', () => {
  let campaignsController: CampaignsController;
  let campaignsService: CampaignsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignsController],
      providers: [
        {
          provide: CampaignsService,
          useValue: {
            findAll: jest.fn(() => []),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUser: jest.fn(() => []),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
            setContext: jest.fn(),
          },
        },
      ],
    }).compile();

    campaignsController = module.get<CampaignsController>(CampaignsController);
    campaignsService = module.get<CampaignsService>(CampaignsService);
  });

  it('should be defined', () => {
    expect(campaignsController).toBeDefined();
  });

  it('should be able to get all campaigns', async () => {
    const filterQuery = {
      limit: null,
      offset: null,
      createdBy: undefined,
      createdOn: undefined,
      includeGDPR: undefined,
      status: undefined,
      type: undefined,
      title: undefined,
      version: undefined,
      sortBy: undefined,
      sortOrder: undefined,
    };

    const companyId = 'testCompany';

    await campaignsController.getAllCampaigns(filterQuery, { companyId });

    expect(campaignsService.findAll).toHaveBeenCalledWith({
      ...filterQuery,
      companyId,
    });
  });
});
