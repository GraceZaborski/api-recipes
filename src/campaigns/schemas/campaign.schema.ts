import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class Condition {
  @Prop()
  condition: string;
}

@Schema()
export class Rules {
  @Prop()
  AND: Condition[];

  @Prop()
  OR: Condition[];
}

@Schema()
export class Module {
  @Prop()
  name: string;

  @Prop()
  value: string;
}

@Schema()
export class Delay {
  @Prop()
  tz: string;
}

@Schema()
export class RecipientVariable {
  @Prop()
  template: string;

  @Prop()
  variable: string;

  @Prop()
  value: string;

  @Prop()
  text: string;
}

@Schema()
export class Touchpoint {
  @Prop({ type: String, unique: true, default: uuidv4 })
  id: string;

  @Prop()
  body: string;

  @Prop()
  subject: string;

  @Prop([Module])
  modules: Module[];

  @Prop([RecipientVariable])
  recipientVariables: RecipientVariable[];

  @Prop()
  rules: Rules;

  @Prop()
  delay: string;

  @Prop()
  first: boolean;

  @Prop()
  createdAt: string;

  @Prop()
  createdBy: string;
}

@Schema()
export class Campaign {
  @Prop({ type: String, unique: true, default: uuidv4 })
  id: string;

  @Prop()
  type: string;

  @Prop()
  status: string;

  @Prop()
  title: string;

  @Prop()
  from: string;

  @Prop([Touchpoint])
  touchpoints?: Touchpoint[];

  @Prop()
  totalRecipients?: number = 0;

  @Prop()
  cancelledAt?: Date;

  @Prop()
  companyId: string;

  @Prop()
  createdAt: Date;

  @Prop()
  createdBy: string;

  @Prop()
  version: number;
}

export type CampaignDocument = Campaign & Document;
export const CampaignSchema = SchemaFactory.createForClass(Campaign);
