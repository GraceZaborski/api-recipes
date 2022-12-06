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

  async findAll(companyId: string): Promise<SettingsDto> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { status, ...defaultFont } = unlayerSettingsFonts[0];
    // TODO: add accent colour if set by company here
    const defaultCompanySettings = {
      fonts: unlayerSettingsFonts,
      defaultFont: defaultFont,
    };
    const companySettings = await this.settingsModel.find({ companyId }).lean();
    const settings = { ...companySettings, ...defaultCompanySettings };
    return settings;
  }
}
