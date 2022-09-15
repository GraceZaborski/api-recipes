import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class RecipientVariable {
  @Prop()
  fallback: string;

  @Prop()
  template: string;

  @Prop()
  variable: string;
}
@Schema()
export class CompanySettingsCampaignsUrl {
  @Prop()
  html: string;

  @Prop()
  htmlSimple?: string;

  @Prop()
  rv?: RecipientVariable[];
}

@Schema()
export class CompanySettingsCampaignsUnsubscribe {
  @Prop({ type: Object })
  url: CompanySettingsCampaignsUrl;
}

@Schema()
export class CompanySettingsCampaigns {
  unsubscribe: CompanySettingsCampaignsUnsubscribe;
}

@Schema()
export class CompanySettings {
  @Prop({ type: Object })
  campaigns?: CompanySettingsCampaigns;
}

@Schema()
export class Company {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop({ type: Object })
  settings: CompanySettings;
}

export type CompanyDocument = Company & Document;
export const CompanySchema = SchemaFactory.createForClass(Company);
