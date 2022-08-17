import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { GcpStorageModule } from '../gcp-storage/gcp-storage.module';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [UploadService, ConfigService],
  controllers: [UploadController],
  imports: [GcpStorageModule],
})
export class UploadModule {}
