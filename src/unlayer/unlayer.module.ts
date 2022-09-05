import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GcpStorageModule } from '../gcp-storage/gcp-storage.module';
import { UnlayerController } from './unlayer.controller';
import { UnlayerService } from './unlayer.service';

@Module({
  controllers: [UnlayerController],
  providers: [UnlayerService, ConfigService],
  imports: [GcpStorageModule],
  exports: [UnlayerService],
})
export class UnlayerModule {}
