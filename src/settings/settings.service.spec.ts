import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Chance } from 'chance';
import { Model } from 'mongoose';
import { SettingsDto } from '../templates/dto/settings.dto';
import { settingsDefaultData } from './default-data/settings-default-data';
import { mockUpdatePayload } from './mock-update-payload';
import { SettingsDocument } from './schemas/settings.schema';
import { SettingsService } from './settings.service';

const chance = new Chance();

describe('SettingsService', () => {
  let service: SettingsService;
  let model: Model<SettingsDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: getModelToken('Settings', 'campaigns'),
          useValue: {
            findOneAndUpdate: jest.fn(),
            findOne: jest.fn(),
            lean: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
    model = module.get<Model<SettingsDocument>>(
      getModelToken('Settings', 'campaigns'),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const companyId = chance.guid();

  const settingsDto: SettingsDto = {
    ...mockUpdatePayload,
    companyId,
    updatedBy: chance.guid(),
    updatedAt: new Date(),
  };

  describe('findOne()', () => {
    it("should return a company's settings", async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValue(settingsDefaultData),
      } as any);

      const settings = await service.findOne(companyId);

      expect(settings).toEqual(settingsDefaultData);
    });
  });

  describe('updateOne()', () => {
    it('should return the created/updated settings', async () => {
      jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({
        lean: jest.fn().mockResolvedValue(settingsDto),
      } as any);

      const settings = await service.updateOne(companyId, settingsDto);

      expect(settings).toEqual(settingsDto);
    });
  });
});
