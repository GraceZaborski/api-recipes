import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { CampaignsService } from './campaigns.service';
import { CampaignDocument } from './schemas/campaign.schema';

describe('CampaignsService', () => {
  let service: CampaignsService;
  let model: Model<CampaignDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignsService,
        {
          provide: getModelToken('Campaign', 'seed'),
          useValue: {
            find: jest.fn(),
            count: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
            new: jest.fn(),
            constructor: jest.fn(),
            create: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            lean: jest.fn(),
            populate: jest.fn(),
            skip: jest.fn(),
            offset: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CampaignsService>(CampaignsService);
    model = module.get<Model<CampaignDocument>>(
      getModelToken('Campaign', 'seed'),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to find one', async () => {
    const campaign = {
      id: '1',
      name: 'test',
      settings: {},
    };

    jest.spyOn(model, 'findOne').mockReturnValue({
      lean: jest.fn().mockResolvedValueOnce(campaign),
    } as any);

    const result = await service.findOne('1');
    expect(result).toEqual(campaign);
    expect(model.findOne).toBeCalledWith({ id: '1' });
  });
});
