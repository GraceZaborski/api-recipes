import {
  IsArray,
  IsBoolean,
  IsDate,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { unlayerSettingsFonts } from '../../settings/default-data/unlayer-system-fonts';
import { Exclude, Type } from 'class-transformer';

// TODO: consider using the swagger plug-in: https://docs.nestjs.com/openapi/cli-plugin#using-the-cli-plugin

class Font {
  @ApiProperty()
  @IsUUID()
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
  @IsUUID()
  @ApiProperty()
  readonly id: string;

  @IsString()
  @ApiProperty()
  readonly colour: string;
}

class ContentTool {
  @IsUUID()
  @ApiProperty()
  readonly id: string;

  @IsString()
  @ApiProperty()
  readonly tool: string;

  @ApiProperty()
  @IsBoolean()
  readonly value: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const { value, ...defaultFont } = unlayerSettingsFonts[0];

export class SettingsDto {
  @Exclude()
  @IsUUID()
  @ApiProperty()
  readonly _id?: string;

  @IsArray()
  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => ContentTool)
  readonly contentTools: ContentTool[];

  // TODO: add accent colour if set by company here
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Colour)
  @ApiProperty()
  readonly colours: Colour[];

  @IsString()
  @ApiProperty()
  @IsOptional()
  readonly backgroundColour?: string = '#ffffff';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Font)
  @ApiProperty()
  readonly fonts: Font[];

  @IsObject()
  @ApiProperty()
  @IsOptional()
  readonly defaultFont?: DefaultFont = defaultFont;

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
  'contentTools',
]) {}
