import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { TemplateDto } from './template.dto';
import { GeneratePreview } from '../../common/types';

export class CreateTemplateDto extends PickType(TemplateDto, [
  'title',
  'subject',
  'unlayer',
]) {
  @ApiProperty()
  @IsOptional()
  readonly generatePreview: GeneratePreview;
}
