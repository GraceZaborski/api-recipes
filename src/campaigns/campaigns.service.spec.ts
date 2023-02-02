import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { CampaignsService } from './campaigns.service';
import { CampaignDocument } from './schemas/campaign.schema';
import { Chance } from 'chance';
import { FilterQueryDto } from './dto';
const chance = new Chance();

export const generateCampaign = (
  companyId?,
  createdBy?,
  status?,
  touchpoints?,
  createdAt?: any,
  version?,
  from?,
  type?,
  title?,
) => ({
  id: chance.guid(),
  companyId: companyId || chance.guid(),
  status: status || 'active',
  title: title || chance.sentence(),
  from: from || chance.email(),
  version: version || 2,
  createdBy: createdBy || chance.guid(),
  touchpoints: touchpoints || [{ id: chance.guid() }],
  createdAt: createdAt || chance.date().toISOString(),
  type: type || 'single',
});

const filterQueryDto: FilterQueryDto = {
  limit: 10,
  offset: 1,
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

export const mockCampaignsCollection = [
  generateCampaign('testCompany'),
  generateCampaign('testCompany'),
  generateCampaign('testCompany'),
];
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

  describe('findAll()', () => {
    it('should return all campaigns and verify default filters', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(mockCampaignsCollection),
        count: jest.fn().mockReturnValue(mockCampaignsCollection.length),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
      } as any);

      await service.findAll({
        ...filterQueryDto,
        companyId: 'testCompany',
      });

      expect(model.find).toHaveBeenCalledWith({
        companyId: 'testCompany',
        version: 2,
      });
    });

    it('should return all campaigns and verify all filters', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(mockCampaignsCollection),
        count: jest.fn().mockReturnValue(mockCampaignsCollection.length),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
      } as any);

      const createdOn = new Date();

      const createdOnFrom = new Date(new Date(createdOn).setHours(0, 0, 0));
      const createdOnTill = new Date(
        new Date(createdOnFrom).setDate(createdOnFrom.getDate() + 1),
      );

      await service.findAll({
        ...filterQueryDto,
        companyId: 'testCompany',
        createdBy: 'testUser',
        includeGDPR: true,
        status: 'active',
        type: 'single',
        title: 'title',
        createdOn: createdOn,
      });

      expect(model.find).toHaveBeenCalledWith({
        companyId: 'testCompany',
        version: 2,
        createdBy: 'testUser',
        createdAt: {
          $gte: createdOnFrom,
          $lte: createdOnTill,
        },
        status: 'active',
        title: {
          $regex: /^.*title/i,
        },
        'touchpoints.recipientVariables.variable': {
          $in: ['optInLink', 'optInBtn'],
        },
        type: 'single',
      });
    });
  });

  it('should return all campaigns with version check', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      lean: jest.fn().mockResolvedValueOnce(mockCampaignsCollection),
      count: jest.fn().mockReturnValue(mockCampaignsCollection.length),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
    } as any);

    await service.findAll({
      ...filterQueryDto,
      companyId: 'testCompany',
      version: 1,
    });

    expect(model.find).toHaveBeenCalledWith({
      companyId: 'testCompany',
      $or: [{ version: 1 }, { version: { $exists: false } }],
    });
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
