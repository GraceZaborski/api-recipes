import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsUUID,
  IsEmail,
  IsNumber,
  IsString,
  MaxLength,
  IsNotEmpty,
  IsDate,
  IsEnum,
} from 'class-validator';

import { Status, CampaignType, Version } from './filterQuery.dto';

@Exclude()
export class CampaignListDto {
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
  @IsEnum(Status)
  @IsNotEmpty()
  @ApiProperty({ enum: Status })
  readonly status: string;

  @Expose()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  readonly from: string;

  @Expose()
  @IsEnum(CampaignType)
  @IsNotEmpty()
  @ApiProperty({ enum: CampaignType })
  readonly type: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ enum: Version })
  readonly version: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly createdBy: string;

  @Expose()
  @IsDate()
  @ApiProperty()
  readonly createdAt: Date;

  @Expose()
  @IsNumber()
  @ApiProperty()
  @Transform(({ value }) => value || 0)
  readonly totalRecipients?: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  @Transform(({ value }) => value.length)
  readonly touchpoints?: any[];

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly companyId: string;
}

@Exclude()
export class PaginatedCampaigns {
  @Expose()
  @IsArray()
  @Type(() => CampaignListDto)
  @ApiProperty({ type: [CampaignListDto] })
  results: CampaignListDto[];

  @Expose()
  @IsNumber()
  @ApiProperty()
  count: number;

  @Expose()
  @IsNumber()
  @ApiProperty()
  limit: number;

  @Expose()
  @IsNumber()
  @ApiProperty()
  offset: number;
}
