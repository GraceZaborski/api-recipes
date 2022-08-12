import { PickType } from '@nestjs/swagger';
import { TemplateDto } from './template.dto';

export class CreateTemplateDto extends PickType(TemplateDto, [
  'title',
  'subject',
  'unlayer',
]) {}
