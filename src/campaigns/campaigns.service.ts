import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign } from './schemas/campaign.schema';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name, 'seed')
    private readonly campaignModel: Model<Campaign>,
  ) {}

  async findOne(id: string): Promise<Campaign> {
    return this.campaignModel.findOne({ id }).lean();
  }
}
