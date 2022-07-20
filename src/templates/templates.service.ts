import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterQueryDto } from './dto';
import { TemplateDto } from './dto/template.dto';
import { Template } from './schemas/template.schema';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template.name) private readonly templateModel: Model<Template>,
  ) {}

  public async findAll(filterQuery: FilterQueryDto): Promise<Template[]> {
    const { limit, offset, search } = filterQuery;
    const findQuery = {};
    if (search) {
      findQuery['$text'] = { $search: search };
    }
    return this.templateModel
      .find(findQuery)
      .skip(offset)
      .limit(limit || 100)
      .exec();
  }

  public async create(templateDto: Omit<TemplateDto, 'id'>): Promise<Template> {
    return this.templateModel.create(templateDto);
  }
}
