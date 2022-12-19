import {
  IsString,
  MaxLength,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UnlayerDesign } from './template.dto';

@Exclude()
export class UpdateTemplateDto {
  @Expose()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @IsNotEmpty()
  @ApiProperty()
  readonly title: string;

  @Expose()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty()
  readonly subject: string;

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => UnlayerDesign)
  @ApiProperty()
  readonly unlayer: UnlayerDesign;
}
