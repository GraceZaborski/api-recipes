import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { setupGlobals } from './globals';
import opentelSDK from './tracing';

async function bootstrap() {
  await opentelSDK.start();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await setupGlobals(app);

  const PORT = app.get(ConfigService).get('port');
  const BIND_ADDRESS = app.get(ConfigService).get('bindAddress');
  await app.listen(PORT, BIND_ADDRESS);
}

bootstrap();
