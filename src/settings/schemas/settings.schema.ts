import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OmitType } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class Font {
  @Prop({ type: String, unique: true, default: uuidv4 })
  id: string;

  @Prop()
  label: string;

  @Prop()
  style: string;

  @Prop()
  value: boolean;
}

@Schema()
export class Colour {
  @Prop({ type: String, unique: true, default: uuidv4 })
  id: string;

  @Prop()
  colour: string;
}

@Schema()
export class ContentTool {
  @Prop({ type: String, unique: true, default: uuidv4 })
  id: string;

  @Prop()
  tool: string;

  @Prop()
  value: boolean;
}

@Schema()
export class DefaultFont extends OmitType(Font, ['value'] as const) {}

@Schema({ versionKey: false })
export class Settings {
  @Prop({ type: String, unique: true, default: uuidv4 })
  _id: string;

  @Prop()
  contentTools: ContentTool[];

  @Prop()
  colours: Colour[];

  @Prop()
  backgroundColour?: string;

  @Prop()
  fonts: Font[];

  @Prop()
  defaultFont?: DefaultFont;

  @Prop()
  companyId?: string;

  @Prop()
  updatedBy?: string;

  @Prop()
  updatedAt?: Date;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);

export type SettingsDocument = Settings & Document;
