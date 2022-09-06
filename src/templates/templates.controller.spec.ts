import { Test, TestingModule } from '@nestjs/testing';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';
import { Chance } from 'chance';
import { CompaniesService } from '../companies/companies.service';

const chance = new Chance();

describe('TemplatesController', () => {
  let templatesController: TemplatesController;
  let templatesService: TemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplatesController],
      providers: [
        {
          provide: TemplatesService,
          useValue: {
            create: jest.fn(() => []),
            findAll: jest.fn(() => []),
            findOne: jest.fn(() => []),
            delete: jest.fn(() => []),
            update: jest.fn(),
            updateOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: CompaniesService,
          useValue: {
            findOne: jest.fn(() => []),
          },
        },
      ],
    }).compile();

    templatesController = module.get<TemplatesController>(TemplatesController);
    templatesService = module.get<TemplatesService>(TemplatesService);
  });

  it('should be defined', () => {
    expect(templatesController).toBeDefined();
  });

  it('should be able to get a single template', async () => {
    const templateId = chance.guid();
    const companyId = chance.guid();
    await templatesController.getTemplate(templateId, { companyId });
    expect(templatesService.findOne).toHaveBeenCalledWith(
      templateId,
      companyId,
    );
  });

  it('should throw if the template does not exist', async () => {
    const templateId = chance.guid();
    const companyId = chance.guid();
    jest.spyOn(templatesService, 'findOne').mockReturnValueOnce(null);
    await expect(
      templatesController.getTemplate(templateId, { companyId }),
    ).rejects.toThrow('Not Found');
  });

  it('should be able to get all templates', async () => {
    const filterQuery = {
      limit: null,
      offset: null,
      search: null,
      createdBy: undefined,
      title: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };

    const companyId = chance.guid();

    await templatesController.getAllTemplates(filterQuery, {
      companyId,
    });

    expect(templatesService.findAll).toHaveBeenCalledWith({
      ...filterQuery,
      companyId,
    });
  });

  it('should add the correct data when creating a template', async () => {
    const newTemplate = {
      title: chance.sentence(),
      subject: chance.sentence(),
      unlayer: {
        json: {},
        previewUrl: chance.url(),
      },
    };

    const authData = {
      userId: chance.guid(),
      companyId: chance.guid(),
    };

    const mockDate = new Date();
    const spy = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate as unknown as string);

    await templatesController.createTemplate(newTemplate, authData);

    expect(templatesService.create).toHaveBeenCalledWith({
      ...newTemplate,
      createdBy: authData.userId,
      companyId: authData.companyId,
      createdAt: mockDate,
      updatedAt: null,
      updatedBy: null,
    });

    spy.mockRestore();
  });

  it('should use the correct ids when deleting a template', async () => {
    const templateId = chance.guid();
    const companyId = chance.guid();
    await templatesController.deleteTemplate(templateId, { companyId });
    expect(templatesService.delete).toHaveBeenCalledWith(templateId, companyId);
  });

  it('should throw if deleting a non-existent template', async () => {
    const templateId = chance.guid();
    const companyId = chance.guid();
    jest.spyOn(templatesService, 'delete').mockReturnValueOnce(null);
    await expect(
      templatesController.deleteTemplate(templateId, { companyId }),
    ).rejects.toThrow('Not Found');
  });

  it('should be able to update a template', async () => {
    const id = chance.guid();
    const companyId = chance.guid();
    const userId = chance.guid();

    const oldTemplate = {
      title: chance.sentence(),
      subject: chance.sentence(),
      unlayer: {
        json: {},
        previewUrl: chance.url(),
      },
      companyId,
      createdBy: userId,
      createdAt: chance.date(),
    };

    const template = {
      title: chance.sentence(),
      subject: chance.sentence(),
      unlayer: {
        json: {},
        previewUrl: chance.url(),
      },
    };

    const authData = {
      userId,
      companyId,
    };

    const mockDate = new Date();
    const spy = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate as unknown as string);

    jest
      .spyOn(templatesService, 'findOne')
      .mockReturnValueOnce(oldTemplate as any);

    await templatesController.updateTemplate(id, template, authData);

    expect(templatesService.updateOne).toHaveBeenCalledWith(id, companyId, {
      ...oldTemplate,
      ...template,
      updatedBy: userId,
      updatedAt: mockDate,
      companyId,
    });

    spy.mockRestore();
  });

  it('should not be possible to override companyId', async () => {
    const id = chance.guid();
    const companyId = chance.guid();
    const userId = chance.guid();

    const oldTemplate = {
      title: chance.sentence(),
      subject: chance.sentence(),
      unlayer: {
        json: {},
        previewUrl: chance.url(),
      },
      companyId,
      createdBy: userId,
      createdAt: chance.date(),
    };

    const template = {
      title: chance.sentence(),
      subject: chance.sentence(),
      unlayer: {
        json: {},
        previewUrl: chance.url(),
      },
      companyId: chance.guid(),
    };

    const authData = {
      userId,
      companyId,
    };

    const mockDate = new Date();
    const spy = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate as unknown as string);

    jest
      .spyOn(templatesService, 'findOne')
      .mockReturnValueOnce(oldTemplate as any);

    await templatesController.updateTemplate(id, template, authData);

    expect(templatesService.updateOne).toHaveBeenCalledWith(id, companyId, {
      ...oldTemplate,
      ...template,
      updatedBy: userId,
      updatedAt: mockDate,
      companyId,
    });

    spy.mockRestore();
  });
});
