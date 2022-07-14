import { Controller, Get, Res, HttpStatus, Query } from '@nestjs/common';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { TemplatesService } from './templates.service';

@Controller('templates')
export class TemplatesController {
  constructor(private templatesService: TemplatesService) {}

  @Get()
  public async getAllTemplates(
    @Res() res,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    const templates = await this.templatesService.findAll(paginationQuery);
    return res.status(HttpStatus.OK).json(templates);
  }
}
