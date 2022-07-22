import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';
import { TemplateDto } from './template.dto';

@Exclude()
export class PaginatedTemplates {
  @Expose()
  @IsArray()
  @Type(() => TemplateDto)
  @ApiProperty({ type: [TemplateDto] })
  results: TemplateDto[];

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
