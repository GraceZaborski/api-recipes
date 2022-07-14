import {
  IsString,
  MaxLength,
  IsNotEmpty,
  IsObject,
  ValidateNested,
  IsUrl,
  IsArray,
  IsDate,
  IsEmpty,
} from 'class-validator';

class UnlayerDesign {
  @IsObject()
  readonly json: Record<string, any>;

  @IsString()
  @IsUrl()
  readonly previewUrl: string;
}

export class CreateTemplateDto {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  readonly title: string;

  @ValidateNested()
  readonly unlayer: UnlayerDesign;

  @IsArray()
  readonly recipientVariables: Record<string, any>[];

  @IsString()
  readonly companyId: string;

  @IsString()
  readonly createdBy: string;

  @IsDate()
  readonly createdAt: Date = new Date();

  @IsEmpty()
  readonly updatedBy: string;

  @IsEmpty()
  readonly updatedAt: Date;
}
