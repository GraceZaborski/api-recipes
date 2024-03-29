import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './schemas/company.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Company.name, schema: CompanySchema }],
      'seed',
    ),
  ],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
