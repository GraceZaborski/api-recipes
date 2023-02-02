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
import { OpenTelemetryModule } from 'nestjs-otel';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    LoggerModule,
    AuthModule.forRoot(),
    OpenTelemetryModule.forRoot({
      metrics: {
        hostMetrics: true,
        apiMetrics: {
          enable: true,
          defaultAttributes: {
            service_name: 'api-campaigns',
          },
          ignoreRoutes: ['/heartbeat/readiness', '/heartbeat/liveness'],
          ignoreUndefinedRoutes: false,
        },
      },
    }),
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
    CampaignsModule,
    UnlayerModule,
    GcpStorageModule,
    UploadModule,
    CompaniesModule,
    SettingsModule,
  ],
  controllers: [HeartbeatController],
  providers: [],
})
export class AppModule {}
