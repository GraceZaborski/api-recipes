import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterQueryDto } from './dto';
import { PaginatedTemplates } from './dto/paginatedTemplates.dto';
import { TemplateDto } from './dto/template.dto';
import { Template } from './schemas/template.schema';
import * as _ from 'lodash';

type FilterWithCompany = FilterQueryDto & { companyId?: string };
type TemplatesMongoFilter = Omit<FilterWithCompany, 'title' | 'deletedAt'> & {
  title?: { $regex: RegExp };
  deletedAt: any;
};

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template.name, 'campaigns')
    private readonly templateModel: Model<Template>,
  ) {}

  public async findOne(id: string, companyId: string): Promise<TemplateDto> {
    return this.templateModel
      .findOne({ id, companyId, deletedAt: { $exists: false } })
      .lean();
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
      title = undefined,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filterQuery;
    const findQuery: Partial<TemplatesMongoFilter> = {
      companyId,
      deletedAt: { $exists: false },
    };

    if (search) {
      findQuery['$text'] = { $search: search };
    }

    if (createdBy) {
      findQuery.createdBy = createdBy;
    }

    if (title) {
      findQuery.title = {
        $regex: new RegExp('^' + _.escapeRegExp(title) + '$', 'i'),
      };
    }

    const results = await this.templateModel
      .find(findQuery)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    const count = await this.templateModel.find(findQuery).count();

    return { results, count, limit, offset };
  }

  public async create(templateDto: Omit<TemplateDto, 'id'>): Promise<Template> {
    return this.templateModel.create(templateDto);
  }

  public async delete(
    id: string,
    companyId: string,
    deletedBy: string,
  ): Promise<TemplateDto> {
    return this.templateModel
      .findOneAndUpdate(
        { id, companyId, deletedAt: { $exists: false } },
        { deletedAt: new Date(), deletedBy },
      )
      .exec();
  }

  public async updateOne(
    id,
    companyId,
    templateDto: Omit<TemplateDto, 'id'>,
  ): Promise<Template> {
    return this.templateModel.findOneAndUpdate(
      { id, companyId, deletedAt: { $exists: false } },
      templateDto,
      {
        returnDocument: 'after',
      },
    );
  }

  public async uniqueCreatedByList(companyId: string): Promise<object> {
    return (
      await this.templateModel.distinct('createdBy', {
        companyId,
        deletedAt: { $exists: false },
      })
    ).map((id) => ({ id, companyId }));
  }
}
