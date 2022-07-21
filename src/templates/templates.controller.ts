import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { ACL, AuthContext } from '@cerbero/mod-auth';
import { TemplateDto, FilterQueryDto, CreateTemplateDto } from './dto';
import { TemplatesService } from './templates.service';
import { TransformInterceptor } from '../interceptors/classTransformer.interceptor';
@Controller('templates')
@UseInterceptors(new TransformInterceptor(TemplateDto))
export class TemplatesController {
  constructor(private templatesService: TemplatesService) {}

  @Get()
  @ACL('templates/template:view')
  public async getAllTemplates(
    @Query() filterQuery: FilterQueryDto,
    @AuthContext() { companyId },
  ) {
    const templates = await this.templatesService.findAll({
      ...filterQuery,
      companyId,
    });
    return templates;
  }

  @Post()
  @ACL('templates/template:create')
  public async createTemplate(
    @Body() templateDto: CreateTemplateDto,
    @AuthContext() { userId: createdBy, companyId },
  ): Promise<TemplateDto | Error> {
    const payload = {
      ...templateDto,
      companyId,
      createdBy,
      createdAt: new Date(),
      updatedBy: null,
      updatedAt: null,
    };

    return this.templatesService.create(payload);
  }
}
