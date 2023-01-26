import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign } from './schemas/campaign.schema';
import { FilterQueryDto } from './dto/filterQuery.dto';
import * as _ from 'lodash';
import { PaginatedCampaigns } from './dto';

type FilterWithCompany = FilterQueryDto & { companyId: string };
type CampaignsMongoFilter = Omit<FilterWithCompany, 'title' | 'createdOn'> & {
  title?: { $regex: RegExp };
  createdAt?: { $gte?: Date; $lte?: Date };
  $or?: any[];
};

const DAY = 86400000;
@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name, 'seed')
    private readonly campaignModel: Model<Campaign>,
  ) {}

  async findOne(id: string): Promise<Campaign> {
    return this.campaignModel.findOne({ id }).lean();
  }

  async findAll(params: FilterWithCompany): Promise<PaginatedCampaigns> {
    const {
      companyId,
      createdBy = undefined,
      includeGDPR = false,
      limit = 20,
      offset = 0,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status = undefined,
      type = undefined,
      title = undefined,
      version = 2,
      createdOn,
    } = params;

    const findQuery: Partial<CampaignsMongoFilter> = { companyId };

    if (createdBy) {
      findQuery.createdBy = createdBy;
    }

    if (includeGDPR) {
      findQuery['touchpoints.recipientVariables.variable'] = {
        $in: ['optInLink', 'optInBtn'],
      };
    }

    if (status) {
      findQuery.status = status;
    }

    if (type) {
      findQuery.type = type;
    }

    if (title) {
      findQuery.title = {
        $regex: new RegExp('^.*' + _.escapeRegExp(title), 'i'),
      };
    }

    if (createdOn) {
      const createdOnFrom = new Date(createdOn.setHours(0, 0, 0));
      const createOnTill = new Date(createdOn.getTime() + DAY);
      findQuery.createdAt = {
        $gte: createdOnFrom,
        $lte: createOnTill,
      };
    }

    if (version === 1) {
      findQuery.$or = [{ version: 1 }, { version: { $exists: false } }];
    } else {
      findQuery.version = 2;
    }

    const results = await this.campaignModel
      .find(findQuery)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    const count = await this.campaignModel.find(findQuery).count();

    return { results, count, limit, offset };
  }
}
