import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { Template, TemplateSchema } from './schemas/template.schema';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Template.name, schema: TemplateSchema }],
      'campaigns',
    ),
    CompaniesModule,
  ],
  controllers: [TemplatesController],
  providers: [TemplatesService],
})
export class TemplatesModule {}
