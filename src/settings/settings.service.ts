import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SettingsDto } from '../templates/dto/settings.dto';
import { unlayerSettingsFonts } from './default-data/unlayer-system-fonts';
import { Settings } from './schemas/settings.schema';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Settings.name, 'campaigns')
    private readonly settingsModel: Model<Settings>,
  ) {}

  public async findOne(companyId: string): Promise<SettingsDto> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { status, ...defaultFont } = unlayerSettingsFonts[0];
    const companySettings = await this.settingsModel
      .findOne({ companyId })
      .lean();
    return companySettings;
  }

  public async updateOne(companyId, settingsDto): Promise<SettingsDto> {
    return this.settingsModel
      .findOneAndUpdate(companyId, settingsDto, {
        returnDocument: 'after',
        upsert: true,
      })
      .lean();
  }
}
