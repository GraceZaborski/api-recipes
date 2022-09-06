import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './schemas/company.schema';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name, 'seed')
    private readonly companyModel: Model<Company>,
  ) {}

  async findOne(id: string): Promise<Company> {
    return this.companyModel.findOne({ id }).lean();
  }
}
