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

  async findAll(companyId: string): Promise<SettingsDto> {
    return this.settingsModel.find({ companyId }).lean();
  }
}
