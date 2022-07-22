import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterQueryDto } from './dto';
import { PaginatedTemplates } from './dto/paginatedTemplates.dto';
import { TemplateDto } from './dto/template.dto';
import { Template } from './schemas/template.schema';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template.name) private readonly templateModel: Model<Template>,
  ) {}

  public async findAll(
    filterQuery: FilterQueryDto & { companyId?: string },
  ): Promise<PaginatedTemplates> {
    const { limit = 20, offset = 0, search, companyId } = filterQuery;
    const findQuery = { companyId };
    if (search) {
      findQuery['$text'] = { $search: search };
    }
    const results = await this.templateModel
      .find(findQuery)
      .skip(offset)
      .limit(limit)
      .exec();

    const count = await this.templateModel.count();

    return { results, count, limit, offset };
  }

  public async create(templateDto: Omit<TemplateDto, 'id'>): Promise<Template> {
    return this.templateModel.create(templateDto);
  }
}
