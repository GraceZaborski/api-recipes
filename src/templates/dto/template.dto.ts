import {
  IsString,
  MaxLength,
  IsNotEmpty,
  IsObject,
  ValidateNested,
  IsUrl,
  IsDate,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class UnlayerDesign {
  @Expose()
  @IsObject()
  @ApiProperty()
  readonly json: Record<string, any>;

  @Expose()
  @IsOptional()
  @IsString()
  @IsUrl()
  readonly previewUrl: string;
}

@Exclude()
export class TemplateDto {
  @Expose()
  @IsUUID()
  @ApiProperty()
  readonly id: string;

  @Expose()
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  @ApiProperty()
  readonly title: string;

  @Expose()
  @IsString()
  @MaxLength(255)
  @ApiProperty()
  readonly subject: string;

  @Expose()
  @ValidateNested()
  @Type(() => UnlayerDesign)
  @ApiProperty()
  readonly unlayer: UnlayerDesign;

  @Expose()
  @IsString()
  @ApiProperty()
  readonly companyId: string;

  @Expose()
  @IsString()
  @ApiProperty()
  readonly createdBy: string;

  @Expose()
  @IsDate()
  @ApiProperty()
  readonly createdAt: Date;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly updatedBy: string;

  @Expose()
  @IsDate()
  @IsOptional()
  @ApiProperty()
  readonly updatedAt: Date;
}
