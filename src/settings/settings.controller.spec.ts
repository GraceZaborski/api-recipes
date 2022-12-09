import { Test, TestingModule } from '@nestjs/testing';
import { Chance } from 'chance';
import { Logger } from '../logger';
import { settingsDefaultData } from './default-data/settings-default-data';
import { mockUpdatePayload } from './mock-update-payload';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

const chance = new Chance();

describe('SettingsController', () => {
  let settingsController: SettingsController;
  let settingsService: SettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [
        {
          provide: SettingsService,
          useValue: {
            findOne: jest.fn(() => []),
            updateOne: jest.fn(),
            delete: jest.fn(() => []),
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

    settingsController = module.get<SettingsController>(SettingsController);
    settingsService = module.get<SettingsService>(SettingsService);
  });

  it('should be defined', () => {
    expect(settingsController).toBeDefined();
  });

  it('should call findOne service', async () => {
    const companyId = chance.guid();
    await settingsController.getSettings({ companyId });
    expect(settingsService.findOne).toHaveBeenCalledWith(companyId);
  });

  it('should call the updateOne service with the correct data', async () => {
    const mockDate = new Date();
    const spy = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate as unknown as string);

    const companyId = chance.guid();
    const userId = chance.guid();
    const updateSettingsDto = {
      ...mockUpdatePayload,
      backgroundColour: '#ffffff',
      defaultFont: settingsDefaultData.defaultFont,
    };

    await settingsController.updateSettings(updateSettingsDto, {
      userId,
      companyId,
    });

    const payload = {
      ...updateSettingsDto,
      updatedBy: userId,
      companyId,
      updatedAt: mockDate,
    };
    expect(settingsService.updateOne).toHaveBeenCalledWith(companyId, payload);
    spy.mockRestore();
  });

  it('should call the updateOne service with the correct transformed data', async () => {
    const mockDate = new Date();
    const spy = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate as unknown as string);

    const companyId = chance.guid();
    const userId = chance.guid();
    const updateSettingsDto = {
      ...mockUpdatePayload,
      colours: ['#ffffff', '#ffffff', '#000000', '#gggggg'],
      backgroundColour: '#hijkl',
    };
    await settingsController.updateSettings(updateSettingsDto, {
      userId,
      companyId,
    });

    const payload = {
      ...updateSettingsDto,
      colours: [updateSettingsDto.colours[1], updateSettingsDto.colours[2]],
      backgroundColour: undefined,
      updatedBy: userId,
      companyId,
      updatedAt: mockDate,
    };
    expect(settingsService.updateOne).toHaveBeenCalledWith(companyId, payload);
    spy.mockRestore();
  });
});
