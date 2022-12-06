import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OmitType } from '@nestjs/swagger';

@Schema()
export class Font {
  @Prop()
  label: string;
  value: string;
  status: boolean;
}

@Schema()
export class DefaultFont extends OmitType(Font, ['status'] as const) {}

@Schema()
export class Settings {
  @Prop()
  colours?: string[];

  @Prop()
  backgroundColour?: string;

  @Prop()
  fonts: Font[];

  @Prop()
  defaultFont: DefaultFont;

  @Prop()
  companyId?: string;

  @Prop()
  updatedBy?: string;

  @Prop()
  updatedAt?: Date;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
