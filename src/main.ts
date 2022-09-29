import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { setupGlobals } from './globals';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  setupGlobals(app);

  const PORT = app.get(ConfigService).get('port');
  console.log('-----', PORT);
  const BIND_ADDRESS = app.get(ConfigService).get('bindAddress');
  await app.listen(PORT, BIND_ADDRESS);
}

bootstrap();
