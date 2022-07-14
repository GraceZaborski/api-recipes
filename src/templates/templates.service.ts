import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { TemplateDto } from './dto/template.dto';
import { Template } from './schemas/template.schema';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template.name) private readonly templateModel: Model<Template>,
  ) {}

  public async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<Template[]> {
    const { limit, offset } = paginationQuery;
    return this.templateModel.find().skip(offset).limit(limit).exec();
  }

  public async create(templateDto: Omit<TemplateDto, 'id'>): Promise<Template> {
    console.log(templateDto);
    return this.templateModel.create(templateDto);
  }
}
