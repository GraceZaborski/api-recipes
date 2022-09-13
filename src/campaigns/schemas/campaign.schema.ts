import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Campaign {
  @Prop()
  id: string;

  @Prop()
  companyId: string;

  @Prop()
  createdBy: string;
}

export type CampaignDocument = Campaign & Document;
export const CampaignSchema = SchemaFactory.createForClass(Campaign);
