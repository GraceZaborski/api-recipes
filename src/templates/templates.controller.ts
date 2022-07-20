import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { ACL, AuthContext } from '@cerbero/mod-auth';
import { TemplateDto, CreateTemplateDto, FilterQueryDto } from './dto';
import { TemplatesService } from './templates.service';
import { TransformInterceptor } from '../interceptors/classTransformer.interceptor';
@Controller('templates')
export class TemplatesController {
  constructor(private templatesService: TemplatesService) {}

  @Get()
  @UseInterceptors(new TransformInterceptor(TemplateDto))
  @ACL('templates/template:view')
  public async getAllTemplates(@Query() filterQuery: FilterQueryDto) {
    const templates = await this.templatesService.findAll(filterQuery);
    return templates;
  }

  @Post()
  @UseInterceptors(new TransformInterceptor(TemplateDto))
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

    try {
      const template = await this.templatesService.create(payload);
      return template;
    } catch (error) {
      return new BadRequestException('Template creation failed');
    }
  }
}
