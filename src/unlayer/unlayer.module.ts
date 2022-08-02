import { Module } from '@nestjs/common';
import { GcpStorageService } from '../gcp-storage/gcp-storage.service';
import { UnlayerController } from './unlayer.controller';

@Module({
  controllers: [UnlayerController],
  providers: [GcpStorageService],
})
export class UnlayerModule {}
