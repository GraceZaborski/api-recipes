import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@cerbero/mod-auth';
import { HeartbeatController } from './heartbeat/heartbeat.controller';
import { LoggerModule } from './logger';
import { TemplatesModule } from './templates/templates.module';

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
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('mongoUri'),
      }),
      inject: [ConfigService],
    }),
    TemplatesModule,
  ],
  controllers: [HeartbeatController],
  providers: [],
})
export class AppModule {}
