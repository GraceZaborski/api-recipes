import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GcpStorageService } from './gcp-storage.service';

@Module({
  providers: [GcpStorageService, ConfigService],
  exports: [GcpStorageService],
})
export class GcpStorageModule {}
