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
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('mongo'),
      inject: [ConfigService],
    }),
    TemplatesModule,
    UnlayerModule,
    GcpStorageModule,
    UploadModule,
  ],
  controllers: [HeartbeatController],
  providers: [],
})
export class AppModule {}
