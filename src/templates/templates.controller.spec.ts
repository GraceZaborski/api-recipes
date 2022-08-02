import { Test, TestingModule } from '@nestjs/testing';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';
import { Chance } from 'chance';

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
            update: jest.fn(),
            remove: jest.fn(),
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
      recipientVariables: [],
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
});
