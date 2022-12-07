import { Test, TestingModule } from '@nestjs/testing';
import { Chance } from 'chance';
import { Logger } from '../logger';
import { defaultFont } from '../templates/dto/settings.dto';
import { settingsDefaultData } from './default-data/settings-default-data';
import { unlayerContentTools } from './default-data/unlayer-content-tools';
import { unlayerSettingsFonts } from './default-data/unlayer-system-fonts';
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

  // E2E
  it('should return the default data when a document does not exist', async () => {
    const companyId = chance.guid();
    await settingsController.getSettings({ companyId });
    expect(settingsService.findOne).toHaveBeenCalledWith(companyId);
    expect(settingsController).toEqual(settingsDefaultData);
  });

  it('should call the updateOne service with the correct data (when creating document)', async () => {
    const companyId = chance.guid();
    const userId = chance.guid();
    const updateSettingsDto = {
      colours: [],
      backgroundColour: '#ffffff',
      fonts: unlayerSettingsFonts,
      defaultFont: defaultFont,
      contentTools: unlayerContentTools,
    };
    await settingsController.updateSettings(updateSettingsDto, {
      userId,
      companyId,
    });

    const payload = {
      ...updateSettingsDto,
      updatedBy: userId,
      companyId,
      updatedAt: new Date(),
    };
    expect(settingsService.updateOne).toHaveBeenCalledWith(companyId, payload);
  });

  it('should call the updateOne service with the correct transformed data (when creating document)', async () => {
    const companyId = chance.guid();
    const userId = chance.guid();
    const updateSettingsDto = {
      colours: [
        { id: '1', colour: '#ffffff' },
        { id: '2', colour: '#ffffff' },
        { id: '3', colour: '#000000' },
        { id: '4', colour: '#gggggg' },
      ],
      backgroundColour: '#hijkl',
      fonts: unlayerSettingsFonts,
      defaultFont: defaultFont,
      contentTools: unlayerContentTools,
    };
    await settingsController.updateSettings(updateSettingsDto, {
      userId,
      companyId,
    });

    const payload = {
      ...updateSettingsDto,
      colours: [
        { id: '2', colour: '#ffffff' },
        { id: '3', colour: '#000000' },
      ],
      backgroundColour: undefined,
      updatedBy: userId,
      companyId,
      updatedAt: new Date(),
    };
    expect(settingsService.updateOne).toHaveBeenCalledWith(companyId, payload);
  });

  // E2E
  it('should update the existing document data correctly when using the updateOne service', async () => {
    const companyId = chance.guid();
    const userId = chance.guid();
    const updateSettingsDto = {
      colours: [
        { id: '1', colour: '#ffffff' },
        { id: '2', colour: '#ffffff' },
        { id: '3', colour: '#000000' },
        { id: '4', colour: '#gggggg' },
      ],
      backgroundColour: '#ffffff',
      fonts: unlayerSettingsFonts,
      defaultFont: defaultFont,
      contentTools: unlayerContentTools,
    };
    await settingsController.updateSettings(updateSettingsDto, {
      userId,
      companyId,
    });

    const userId2 = chance.guid();
    const updateSettingsDto2 = {
      ...updateSettingsDto,
      colours: [{ id: '1', colour: '#123456' }],
      backgroundColour: '#123456',
      fonts: [
        ...updateSettingsDto.fonts,
        (updateSettingsDto.fonts[0] = updateSettingsDto.fonts[1]),
      ],
      defaultFont: undefined,
      contentTools: [
        ...updateSettingsDto.contentTools,
        (updateSettingsDto.contentTools[0] = updateSettingsDto.contentTools[1]),
      ],
    };

    await settingsController.updateSettings(updateSettingsDto2, {
      userId: userId2,
      companyId,
    });

    const payload = {
      ...updateSettingsDto2,
      updatedBy: userId2,
      companyId,
      updatedAt: new Date(),
    };
    expect(settingsService.updateOne).toHaveBeenCalledWith(companyId, payload);
    expect(settingsController).toEqual(payload);
  });

  // E2E
  it('should return the default data when undefined is used in payload', async () => {
    const companyId = chance.guid();
    const userId = chance.guid();
    const updateSettingsDto = {
      colours: [],
      fonts: unlayerSettingsFonts,
      contentTools: unlayerContentTools,
    };
    await settingsController.updateSettings(updateSettingsDto, {
      userId,
      companyId,
    });

    const payload = {
      ...updateSettingsDto,
      updatedBy: userId,
      companyId,
      updatedAt: new Date(),
    };

    // const response = { ...payload, defaultFont, backgroundColour: '#ffffff' };
    expect(settingsService.updateOne).toHaveBeenCalledWith(companyId, payload);
    expect(settingsController).toEqual(payload);
  });
});
