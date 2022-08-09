import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterQueryDto } from './dto';
import { PaginatedTemplates } from './dto/paginatedTemplates.dto';
import { TemplateDto } from './dto/template.dto';
import { Template } from './schemas/template.schema';

type FilterWithCompany = FilterQueryDto & { companyId?: string };
@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template.name) private readonly templateModel: Model<Template>,
  ) {}

  public async findOne(id: string, companyId: string): Promise<TemplateDto> {
    return this.templateModel.findOne({ id, companyId }).lean();
  }

  public async findAll(
    filterQuery: FilterWithCompany,
  ): Promise<PaginatedTemplates> {
    const {
      limit = 20,
      offset = 0,
      search,
      companyId,
      createdBy = undefined,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filterQuery;
    const findQuery: Partial<FilterWithCompany> = { companyId };

    if (search) {
      findQuery['$text'] = { $search: search };
    }

    if (createdBy) {
      findQuery.createdBy = createdBy;
    }

    const results = await this.templateModel
      .find(findQuery)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    const count = await this.templateModel.count();

    return { results, count, limit, offset };
  }

  public async create(templateDto: Omit<TemplateDto, 'id'>): Promise<Template> {
    return this.templateModel.create(templateDto);
  }

  public async delete(id: string, companyId: string): Promise<TemplateDto> {
    return this.templateModel.findOneAndDelete({ id, companyId }).exec();
  }

  public async updateOne(
    id,
    companyId,
    templateDto: Omit<TemplateDto, 'id'>,
  ): Promise<Template> {
    return this.templateModel.findOneAndUpdate({ id, companyId }, templateDto, {
      returnDocument: 'after',
    });
  }
}
