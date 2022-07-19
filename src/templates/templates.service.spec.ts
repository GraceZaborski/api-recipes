import { Test, TestingModule } from '@nestjs/testing';
import { TemplatesService } from './templates.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chance } from 'chance';
import { TemplateDto } from './dto';
import { TemplateDocument } from './schemas/template.schema';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

const chance = new Chance();

const generateTemplate = (): any => ({
  title: chance.sentence(),
  unlayer: {
    json: {},
    previewUrl: chance.url(),
  },
  companyId: chance.guid(),
  createdBy: chance.guid(),
  createdAt: chance.date(),
  updatedBy: null,
  updatedAt: null,
});

const mockTemplate = generateTemplate();
const mockTemplateCollection = [...Array(10).keys()].map(generateTemplate);

describe('TemplatesService', () => {
  let service: TemplatesService;
  let model: Model<TemplateDocument>;

  const paginationQueryDto: PaginationQueryDto = {
    limit: 10,
    offset: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplatesService,
        {
          provide: getModelToken('Template'),
          useValue: {
            find: jest.fn().mockReturnValue(mockTemplateCollection),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndRemove: jest.fn(),
            new: jest.fn().mockResolvedValue(mockTemplate),
            constructor: jest.fn().mockResolvedValue(mockTemplate),
            create: jest.fn().mockResolvedValue(TemplateDto),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
            populate: jest.fn(),
            skip: jest.fn(),
            offset: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TemplatesService>(TemplatesService);
    model = module.get<Model<TemplateDocument>>(getModelToken('Template'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return all templates', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockTemplateCollection),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
      } as any);

      const templates = await service.findAll(paginationQueryDto);
      expect(templates).toEqual(mockTemplateCollection);
    });
  });
});
