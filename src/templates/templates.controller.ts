import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  UseInterceptors,
  NotFoundException,
  Delete,
  Param,
  HttpCode,
  Put,
} from '@nestjs/common';
import { ACL, AuthContext } from '@cerbero/mod-auth';
import { TemplateDto, FilterQueryDto, CreateTemplateDto } from './dto';
import { TemplatesService } from './templates.service';
import { TransformInterceptor } from '../interceptors/classTransformer.interceptor';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiNotFoundResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/errorResponse.dto';
import { PaginatedTemplates } from './dto/paginatedTemplates.dto';
import { CompaniesService } from '../companies/companies.service';

@ApiTags('templates')
@ApiSecurity('api_key')
@Controller('templates')
export class TemplatesController {
  constructor(
    private templatesService: TemplatesService,
    private companiesService: CompaniesService,
  ) {}

  @Get('/test')
  public async test() {
    const company = await this.companiesService.findOne('427cd31dbb0c78500714');
    return company;
  }

  @Get()
  @ACL('templates/template:view')
  @UseInterceptors(new TransformInterceptor(PaginatedTemplates))
  @ApiOkResponse({ type: PaginatedTemplates })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  public async getAllTemplates(
    @Query() filterQuery: FilterQueryDto,
    @AuthContext() { companyId },
  ) {
    return this.templatesService.findAll({
      ...filterQuery,
      companyId,
    });
  }

  @Get('/:id')
  @ACL('templates/template:view')
  @ApiOkResponse({ type: TemplateDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @UseInterceptors(new TransformInterceptor(TemplateDto))
  public async getTemplate(
    @Param('id') id: string,
    @AuthContext() { companyId },
  ) {
    const template = await this.templatesService.findOne(id, companyId);

    if (!template) {
      throw new NotFoundException();
    }

    return template;
  }

  @Post()
  @ACL('templates/template:create')
  @UseInterceptors(new TransformInterceptor(TemplateDto))
  @ApiCreatedResponse({ type: TemplateDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiConflictResponse({ type: ErrorResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  public async createTemplate(
    @Body() templateDto: CreateTemplateDto,
    @AuthContext() { userId: createdBy, companyId },
  ): Promise<TemplateDto | Error> {
    const payload = {
      ...templateDto,
      companyId,
      createdBy,
      unlayer: {
        ...templateDto.unlayer,
        previewUrl: templateDto.unlayer.previewUrl
          ? templateDto.unlayer.previewUrl
          : null,
      },
      createdAt: new Date(),
      updatedBy: null,
      updatedAt: null,
    };

    return this.templatesService.create(payload);
  }

  @Delete('/:id')
  @ACL('templates/template:remove')
  @HttpCode(204)
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  public async deleteTemplate(
    @Param('id') id: string,
    @AuthContext() { companyId },
  ) {
    const template = await this.templatesService.delete(id, companyId);

    if (!template) throw new NotFoundException();
  }

  @Put('/:id')
  @ACL('templates/template:edit')
  @UseInterceptors(new TransformInterceptor(TemplateDto))
  @ApiOkResponse({ type: TemplateDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiConflictResponse({ type: ErrorResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  public async updateTemplate(
    @Param('id') id: string,
    @Body() templateDto: CreateTemplateDto,
    @AuthContext() { userId: updatedBy, companyId },
  ): Promise<TemplateDto | Error> {
    const template = await this.templatesService.findOne(id, companyId);

    if (!template) {
      throw new NotFoundException();
    }

    const payload = {
      ...template,
      ...templateDto,
      unlayer: {
        ...templateDto.unlayer,
        previewUrl: templateDto.unlayer.previewUrl
          ? templateDto.unlayer.previewUrl
          : null,
      },
      companyId,
      updatedBy,
      updatedAt: new Date(),
    };

    return this.templatesService.updateOne(id, companyId, payload);
  }
}
