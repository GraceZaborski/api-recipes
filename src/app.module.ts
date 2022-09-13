import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@cerbero/mod-auth';
import { HeartbeatController } from './heartbeat/heartbeat.controller';
import { LoggerModule } from './logger';
import { TemplatesModule } from './templates/templates.module';
import { UnlayerModule } from './unlayer/unlayer.module';
import { GcpStorageModule } from './gcp-storage/gcp-storage.module';
import { UploadModule } from './upload/upload.module';
import { CompaniesModule } from './companies/companies.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import configuration from './config/configuration';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    LoggerModule,
    AuthModule.forRoot(),
    MongooseModule.forRootAsync({
      connectionName: 'campaigns',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('mongo'),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      connectionName: 'seed',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('mongoSeed'),
      inject: [ConfigService],
    }),
    TemplatesModule,
    UnlayerModule,
    GcpStorageModule,
    UploadModule,
    CompaniesModule,
    CampaignsModule,
  ],
  controllers: [HeartbeatController],
  providers: [],
})
export class AppModule {}
