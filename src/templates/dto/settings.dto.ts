import {
  IsArray,
  IsBoolean,
  IsDate,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { unlayerSettingsFonts } from '../../settings/default-data/unlayer-system-fonts';
import { Type } from 'class-transformer';

// TODO: consider using the swagger plug-in: https://docs.nestjs.com/openapi/cli-plugin#using-the-cli-plugin

class Font {
  @ApiProperty()
  @IsString()
  readonly id: string;
  @ApiProperty()
  @IsString()
  readonly label: string;
  @ApiProperty()
  @IsString()
  readonly style: string;
  @ApiProperty()
  @IsBoolean()
  readonly value: boolean;
}

class DefaultFont extends OmitType(Font, ['value'] as const) {}

class Colour {
  @IsObject()
  @ApiProperty()
  @IsOptional()
  readonly id: string;
  readonly colour: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { value, ...defaultFont } = unlayerSettingsFonts[0];

export class SettingsDto {
  // TODO: add accent colour if set by company here
  @IsArray()
  @Type(() => Colour)
  @ApiProperty()
  readonly colours: Colour[];

  @IsString()
  @ApiProperty()
  @IsOptional()
  readonly backgroundColour?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Font)
  @ApiProperty()
  readonly fonts: Font[];

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => Font)
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
  'colours',
  'backgroundColour',
  'fonts',
  'defaultFont',
]) {}
