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
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import { unlayerSettingsFonts } from '../../settings/default-data/unlayer-system-fonts';
import { Exclude, Type } from 'class-transformer';

// TODO: consider using the swagger plug-in: https://docs.nestjs.com/openapi/cli-plugin#using-the-cli-plugin

class Font {
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

class ContentTool {
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
  readonly _id?: string;

  @IsArray()
  @ApiProperty({
    isArray: true,
    type: ContentTool,
  })
  @ValidateNested({ each: true })
  @Type(() => ContentTool)
  readonly contentTools: ContentTool[];

  @IsArray()
  @ApiProperty()
  @IsString({ each: true })
  readonly colours: string[];

  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  readonly backgroundColour?: string = '#ffffff';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Font)
  @ApiProperty({
    isArray: true,
    type: Font,
  })
  readonly fonts: Font[];

  @IsObject()
  @ApiPropertyOptional()
  @IsOptional()
  readonly defaultFont?: DefaultFont = defaultFont;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly companyId?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly updatedBy?: string;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional()
  readonly updatedAt?: Date;
}

export class UpdateSettingsDto extends PickType(SettingsDto, [
  'colours',
  'backgroundColour',
  'fonts',
  'defaultFont',
  'contentTools',
]) {}
