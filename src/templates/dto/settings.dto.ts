import {
  IsArray,
  IsDate,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';

// TODO: consider using the swagger plug-in: https://docs.nestjs.com/openapi/cli-plugin#using-the-cli-plugin

class Colour {
  @IsObject()
  @ApiProperty()
  readonly colour: string;
}

class Font {
  @IsObject()
  @ApiProperty()
  readonly label: string;
  readonly value: string;
  readonly status: boolean;
}

class DefaultFont extends OmitType(Font, ['status'] as const) {}

export class SettingsDto {
  @IsOptional()
  @IsArray()
  @ApiProperty()
  readonly colours: Colour[];

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly backgroundColour: string;

  @IsArray()
  @ApiProperty()
  readonly fonts: Font[];

  @IsObject()
  @ApiProperty()
  readonly defaultFont: DefaultFont;

  @IsString()
  @ApiProperty()
  readonly companyId: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly updatedBy: string;

  @IsDate()
  @IsOptional()
  @ApiProperty()
  readonly updatedAt: Date;
}
