import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export enum SortBy {
  createdAt = 'createdAt',
  title = 'title',
}

export enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

export enum CampaignType {
  single = 'single',
  dynamic = 'dynamic',
  multitouch = 'multitouch',
  triggered = 'triggered',
  bulkEmail = 'bulk_email',
}

export enum Status {
  active = 'active',
  completed = 'complete',
  cancelled = 'cancelled',
}

export enum Version {
  v1 = 1,
  v2 = 2,
}

export class FilterQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'userId' })
  createdBy: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional()
  createdOn: Date;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  @Transform(({ value }) => value === 'true')
  includeGDPR: boolean;

  @IsOptional()
  @IsEnum(Status)
  @ApiPropertyOptional({ enum: Status })
  status: string;

  @IsOptional()
  @IsEnum(CampaignType)
  @ApiPropertyOptional({ enum: CampaignType })
  type: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Title String' })
  title: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ enum: Version })
  version: number;

  @IsOptional()
  @IsEnum(SortBy)
  @ApiPropertyOptional({
    enum: SortBy,
  })
  sortBy: string;

  @IsOptional()
  @IsEnum(SortOrder)
  @ApiPropertyOptional({
    enum: SortOrder,
  })
  sortOrder: string;
}
