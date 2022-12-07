import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OmitType } from '@nestjs/swagger';

@Schema()
export class Font {
  @Prop()
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
  @Prop()
  id: string;

  @Prop()
  colour: string;
}

@Schema()
export class ContentTool {
  @Prop()
  id: string;

  @Prop()
  tool: string;

  @Prop()
  value: boolean;
}

@Schema()
export class DefaultFont extends OmitType(Font, ['value'] as const) {}

@Schema()
export class Settings {
  @Prop()
  contentTools: ContentTool[];

  @Prop()
  colours?: Colour[];

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
