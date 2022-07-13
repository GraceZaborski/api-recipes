import { ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { ecsFormat } from './ecs-format';

const exclude = ['/heartbeat/readiness', '/heartbeat/liveness'];

export const LoggerModule = PinoLoggerModule.forRootAsync({
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const level = config.get<string>('logLevel');
    const pinoHttp = config.get('isLocal') ? { level } : ecsFormat({ level });

    return {
      pinoHttp,
      exclude,
    };
  },
});
