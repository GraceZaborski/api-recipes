import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class UnlayerDesign {
  @Prop({ type: Object })
  json: Record<string, any>;

  @Prop()
  previewUrl: string;
}

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
export class Template {
  @Prop({ type: String, unique: true, default: uuidv4 })
  id: string;

  @Prop()
  title: string;

  @Prop()
  subject: string;

  @Prop({ type: Object })
  unlayer: UnlayerDesign;

  @Prop(Array)
  recipientVariables: RecipientVariable[];

  @Prop()
  companyId: string;

  @Prop()
  createdBy: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedBy: string;

  @Prop()
  updatedAt: Date;
}

export type TemplateDocument = Template & Document;

export const TemplateSchema = SchemaFactory.createForClass(Template);
