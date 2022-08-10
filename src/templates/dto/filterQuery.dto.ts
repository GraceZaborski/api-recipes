import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export enum SortBy {
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  title = 'title',
  subject = 'subject',
}

export enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

export class FilterQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  search: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  createdBy: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  title: string;

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
