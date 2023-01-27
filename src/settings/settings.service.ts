import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SettingsDto } from '../templates/dto/settings.dto';
import { Settings } from './schemas/settings.schema';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Settings.name, 'campaigns')
    private readonly settingsModel: Model<Settings>,
  ) {}

  public async findOne(companyId: string): Promise<SettingsDto> {
    const companySettings = await this.settingsModel
      .findOne({ companyId })
      .lean();
    return companySettings;
  }

  public async updateOne(companyId, settingsDto): Promise<SettingsDto> {
    return this.settingsModel
      .findOneAndUpdate({ companyId }, settingsDto, {
        returnDocument: 'after',
        upsert: true,
      })
      .lean();
  }
}
