import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class UnlayerInternalExportDto {
  @Expose()
  @IsObject()
  @ApiProperty()
  readonly design: Record<string, any>;

  @Expose()
  @IsString()
  @ApiProperty()
  readonly userId: string;

  @Expose()
  @IsString()
  @ApiProperty()
  readonly companyId: string;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly displayMode?: string;
}
