import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { CompaniesService } from './companies.service';
import { CompanyDocument } from './schemas/company.schema';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let model: Model<CompanyDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getModelToken('Company', 'seed'),
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

    service = module.get<CompaniesService>(CompaniesService);
    model = module.get<Model<CompanyDocument>>(
      getModelToken('Company', 'seed'),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to find one', async () => {
    const company = {
      id: '1',
      name: 'test',
      settings: {},
    };

    jest.spyOn(model, 'findOne').mockReturnValue({
      lean: jest.fn().mockResolvedValueOnce(company),
    } as any);

    const result = await service.findOne('1');
    expect(result).toEqual(company);
    expect(model.findOne).toBeCalledWith({ id: '1' });
  });
});
