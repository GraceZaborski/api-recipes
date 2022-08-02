import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  UseInterceptors,
  Param,
  NotFoundException,
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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/errorResponse.dto';
import { PaginatedTemplates } from './dto/paginatedTemplates.dto';

@ApiTags('templates')
@ApiSecurity('api_key')
@Controller('templates')
export class TemplatesController {
  constructor(private templatesService: TemplatesService) {}

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
      createdAt: new Date(),
      updatedBy: null,
      updatedAt: null,
    };

    return this.templatesService.create(payload);
  }
}
