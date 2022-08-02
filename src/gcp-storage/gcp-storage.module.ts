import { Module } from '@nestjs/common';
import { GcpStorageService } from './gcp-storage.service';

@Module({
  providers: [GcpStorageService],
})
export class GcpStorageModule {}
