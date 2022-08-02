import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UnlayerExportImageResponseDto {
  @Expose()
  @IsString()
  @ApiProperty()
  readonly url: string;
}
