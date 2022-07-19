import {
  IsString,
  MaxLength,
  IsNotEmpty,
  IsObject,
  ValidateNested,
  IsUrl,
  IsArray,
  IsDate,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';

class UnlayerDesign {
  @Expose()
  @IsObject()
  readonly json: Record<string, any>;

  @Expose()
  @IsString()
  @IsUrl()
  readonly previewUrl: string;
}

@Exclude()
export class TemplateDto {
  @Expose()
  @IsUUID()
  readonly id: string;

  @Expose()
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  readonly title: string;

  @Expose()
  @IsString()
  @MaxLength(255)
  readonly subject: string;

  @Expose()
  @ValidateNested()
  @Type(() => UnlayerDesign)
  readonly unlayer: UnlayerDesign;

  @Expose()
  @IsArray()
  readonly recipientVariables: Record<string, any>[];

  @Expose()
  @IsString()
  readonly companyId: string;

  @Expose()
  @IsString()
  readonly createdBy: string;

  @Expose()
  @IsDate()
  readonly createdAt: Date;

  @Expose()
  @IsString()
  @IsOptional()
  readonly updatedBy: string;

  @Expose()
  @IsDate()
  @IsOptional()
  readonly updatedAt: Date;
}
