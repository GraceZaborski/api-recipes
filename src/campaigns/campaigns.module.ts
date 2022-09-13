import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignsService } from './campaigns.service';
import { Campaign, CampaignSchema } from './schemas/campaign.schema';

@Module({
  providers: [CampaignsService],
  imports: [
    MongooseModule.forFeature(
      [{ name: Campaign.name, schema: CampaignSchema }],
      'seed',
    ),
  ],
  exports: [CampaignsService],
})
export class CampaignsModule {}
