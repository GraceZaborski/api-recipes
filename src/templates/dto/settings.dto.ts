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
import { Exclude, Type } from 'class-transformer';

// TODO: consider using the swagger plug-in: https://docs.nestjs.com/openapi/cli-plugin#using-the-cli-plugin

class SystemFont {
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

class GoogleFont extends SystemFont {
  @ApiProperty()
  @IsString()
  readonly url: string;
}

class DefaultFont extends OmitType(SystemFont, ['value'] as const) {}

class ContentTool {
  @IsString()
  @ApiProperty()
  readonly tool: string;

  @ApiProperty()
  @IsBoolean()
  readonly value: boolean;
}

class Colour {
  @IsString()
  @ApiProperty()
  readonly colour: string;
}

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
  @ValidateNested({ each: true })
  @Type(() => Colour)
  @ApiProperty({
    isArray: true,
    type: Colour,
  })
  readonly colours: Colour[];

  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  readonly backgroundColour?: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SystemFont)
  @ApiProperty({
    isArray: true,
    type: SystemFont,
  })
  readonly systemFonts: SystemFont[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GoogleFont)
  @ApiProperty({
    isArray: true,
    type: GoogleFont,
  })
  readonly googleFonts: GoogleFont[];

  @IsObject()
  @ApiProperty()
  readonly defaultFont: DefaultFont;

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
  'systemFonts',
  'googleFonts',
  'defaultFont',
  'contentTools',
]) {}
