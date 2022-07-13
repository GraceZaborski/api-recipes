import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@cerbero/mod-auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeartbeatController } from './heartbeat/heartbeat.controller';
import { LoggerModule } from './logger';

import configuration from './config/configuration';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    LoggerModule,
    AuthModule.forRoot(),
  ],
  controllers: [AppController, HeartbeatController],
  providers: [AppService],
})
export class AppModule {}
