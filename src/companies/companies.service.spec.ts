import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';

describe('CompaniesService', () => {
  let service: CompaniesService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
