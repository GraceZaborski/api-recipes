import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OpenTelemetryModule } from '@metinseylan/nestjs-opentelemetry';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { MetricReader } from '@opentelemetry/sdk-metrics';

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
    OpenTelemetryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        serviceName: configService.get('serviceName'),
        metricReader: new PrometheusExporter({
          endpoint: configService.get<string>('telemetry.endpoint'),
          port: configService.get<number>('telemetry.port'),
        }) as any as MetricReader,
      }),
      inject: [ConfigService],
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
