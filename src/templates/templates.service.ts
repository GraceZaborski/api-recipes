import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GeneratePreview } from '../common/types';
import { UnlayerService } from '../unlayer/unlayer.service';
import { FilterQueryDto } from './dto';
import { PaginatedTemplates } from './dto/paginatedTemplates.dto';
import { TemplateDto } from './dto/template.dto';
import { Template } from './schemas/template.schema';

type FilterWithCompany = FilterQueryDto & { companyId?: string };
@Injectable()
export class TemplatesService {
  private unlayerService: UnlayerService;

  constructor(
    @InjectModel(Template.name) private readonly templateModel: Model<Template>,
    unlayerService: UnlayerService,
  ) {
    this.unlayerService = unlayerService;
  }

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
      title = undefined,
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

    if (title) {
      findQuery.title = title;
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

  private async generatePreviewImage(
    generatePreview: GeneratePreview,
    json,
    companyId,
  ) {
    let previewUrl = undefined;

    if (generatePreview) {
      const generatePreviewImage = this.unlayerService.generatePreviewImage(
        { json },
        companyId,
      );

      if (generatePreview === 'sync') {
        const { url } = await generatePreviewImage;
        previewUrl = url;
      }
    }

    return previewUrl;
  }

  public async create(
    templateDto: Omit<TemplateDto, 'id'>,
    generatePreview: GeneratePreview = false,
  ): Promise<Template> {
    const {
      companyId,
      unlayer: { json },
    } = templateDto;

    const previewUrl = await this.generatePreviewImage(
      generatePreview,
      json,
      companyId,
    );

    return this.templateModel.create({
      ...templateDto,
      unlayer: {
        ...templateDto.unlayer,
        previewUrl,
      },
    });
  }

  public async delete(id: string, companyId: string): Promise<TemplateDto> {
    return this.templateModel.findOneAndDelete({ id, companyId }).exec();
  }

  public async updateOne(
    id,
    templateDto: Omit<TemplateDto, 'id'>,
    generatePreview: GeneratePreview = false,
  ): Promise<Template> {
    const {
      unlayer: { json },
      companyId,
    } = templateDto;

    const previewUrl = await this.generatePreviewImage(
      generatePreview,
      json,
      companyId,
    );

    return this.templateModel.findOneAndUpdate(
      { id, companyId },
      {
        ...templateDto,
        unlayer: {
          ...templateDto.unlayer,
          previewUrl,
        },
      },
      {
        returnDocument: 'after',
      },
    );
  }
}
