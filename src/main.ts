import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const PORT = app.get(ConfigService).get('port');
  const BIND_ADDRESS = app.get(ConfigService).get('bindAddress');
  await app.listen(PORT, BIND_ADDRESS);
}
bootstrap();
