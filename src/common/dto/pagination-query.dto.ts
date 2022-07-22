import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumberString } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional()
  limit: number;

  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional()
  offset: number;
}
