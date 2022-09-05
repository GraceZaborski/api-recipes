import { Test, TestingModule } from '@nestjs/testing';
import { TemplatesService } from './templates.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chance } from 'chance';
import { FilterQueryDto, TemplateDto } from './dto';
import { TemplateDocument } from './schemas/template.schema';
import { UnlayerService } from '../unlayer/unlayer.service';

const chance = new Chance();

export const generateTemplate = (): any => ({
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

export const mockTemplate = generateTemplate();
export const mockTemplateCollection = [...Array(10).keys()].map(
  generateTemplate,
);

describe('TemplatesService', () => {
  let service: TemplatesService;
  let model: Model<TemplateDocument>;
  let unlayerService: UnlayerService;

  const filterQueryDto: FilterQueryDto = {
    limit: 10,
    offset: 1,
    search: '',
    createdBy: undefined,
    title: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplatesService,
        {
          provide: getModelToken('Template'),
          useValue: {
            find: jest.fn().mockReturnValue(mockTemplateCollection),
            count: jest.fn().mockReturnValue(mockTemplateCollection.length),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
            new: jest.fn().mockResolvedValue(mockTemplate),
            constructor: jest.fn().mockResolvedValue(mockTemplate),
            create: jest.fn().mockResolvedValue(TemplateDto),
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
        {
          provide: UnlayerService,
          useValue: {
            generatePreviewImage: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TemplatesService>(TemplatesService);
    model = module.get<Model<TemplateDocument>>(getModelToken('Template'));
    unlayerService = module.get<UnlayerService>(UnlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return all templates', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(mockTemplateCollection),
        count: jest.fn().mockReturnValue(mockTemplateCollection.length),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
      } as any);

      const templates = await service.findAll(filterQueryDto);

      expect(templates).toEqual({
        results: mockTemplateCollection,
        count: mockTemplateCollection.length,
        offset: filterQueryDto.offset,
        limit: filterQueryDto.limit,
      });
    });
  });

  describe('findOne()', () => {
    it('should return a single template', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(mockTemplate),
        limit: jest.fn().mockReturnThis(),
      } as any);

      const template = await service.findOne(chance.guid(), chance.guid());
      expect(template).toEqual(template);
    });
  });

  describe('delete()', () => {
    it('should return the deleted template', async () => {
      jest.spyOn(model, 'findOneAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockTemplate),
      } as any);

      const template = await service.delete(chance.guid(), chance.guid());
      expect(template).toEqual(template);
    });
  });

  describe('create()', () => {
    it('should create a template', async () => {
      const template = {
        ...generateTemplate(),
        // generatePreview: 'sync',
      };
      const exampleUrl = undefined;

      jest
        .spyOn(unlayerService, 'generatePreviewImage')
        .mockImplementationOnce(async () => {
          return { url: exampleUrl };
        });

      await service.create(template);

      // expect(unlayerService.generatePreviewImage).toHaveBeenCalledWith(
      //   template.unlayer.json,
      //   template.companyId,
      // );

      expect(model.create).toHaveBeenCalledWith({
        ...template,
        unlayer: {
          ...template.unlayer,
          previewUrl: exampleUrl,
        },
      });
    });
  });

  describe('updateOne()', () => {
    it('should updated a single template', async () => {
      const id = chance.guid();
      const updatedTemplate = generateTemplate();
      const exampleUrl = undefined;

      jest
        .spyOn(unlayerService, 'generatePreviewImage')
        .mockImplementationOnce(async () => {
          return { url: exampleUrl };
        });

      await service.updateOne(id, updatedTemplate);

      // expect(unlayerService.generatePreviewImage).toHaveBeenCalledWith(
      //   updatedTemplate.unlayer.json,
      //   updatedTemplate.companyId,
      // );

      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { id, companyId: updatedTemplate.companyId },
        {
          ...updatedTemplate,
          unlayer: {
            ...updatedTemplate.unlayer,
            previewUrl: exampleUrl,
          },
        },
        { returnDocument: 'after' },
      );
    });
  });
});
