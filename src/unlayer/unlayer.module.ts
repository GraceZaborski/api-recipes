import { Module } from '@nestjs/common';
import { CompaniesModule } from '../companies/companies.module';
import { GcpStorageService } from '../gcp-storage/gcp-storage.service';
import { UserModule } from '../user/user.module';
import { UnlayerController } from './unlayer.controller';
import { UnlayerService } from './unlayer.service';

@Module({
  imports: [CompaniesModule, UserModule],
  controllers: [UnlayerController],
  providers: [GcpStorageService, UnlayerService],
  exports: [UnlayerService],
})
export class UnlayerModule {}
