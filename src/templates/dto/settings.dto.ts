import {
  IsArray,
  IsDate,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { unlayerSettingsFonts } from '../../settings/default-data/unlayer-system-fonts';

// TODO: consider using the swagger plug-in: https://docs.nestjs.com/openapi/cli-plugin#using-the-cli-plugin

class Font {
  @IsObject()
  @ApiProperty()
  readonly label: string;
  readonly value: string;
  readonly status: boolean;
}

class DefaultFont extends OmitType(Font, ['status'] as const) {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { status, ...defaultFont } = unlayerSettingsFonts[0];

export class SettingsDto {
  // TODO: add accent colour if set by company here
  @IsOptional()
  @IsArray()
  @ApiProperty()
  readonly colours?: string[];

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly backgroundColour?: string;

  @IsArray()
  @ApiProperty()
  readonly fonts: Font[] = unlayerSettingsFonts;

  @IsObject()
  @ApiProperty()
  readonly defaultFont: DefaultFont = defaultFont;

  @IsString()
  @ApiProperty()
  readonly companyId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly updatedBy?: string;

  @IsDate()
  @IsOptional()
  @ApiProperty()
  readonly updatedAt?: Date;
}

export class UpdateSettingsDto extends PickType(SettingsDto, [
  'fonts',
  'defaultFont',
  'backgroundColour',
  'colours',
]) {}
