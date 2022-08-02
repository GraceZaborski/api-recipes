import { IsObject } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UnlayerExportDto {
  @Expose()
  @IsObject()
  @ApiProperty()
  readonly json: Record<string, any>;
}
