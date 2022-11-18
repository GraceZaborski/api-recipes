import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MongoValidationExceptionFilter } from './filters/mongoValidationException.filter';
import { config } from './config/configuration';
import { contentParser } from 'fastify-multer';
import { Logger } from './logger';
import { AllExceptionsFilter } from './filters/catch-all-exception.filter';

export async function setupGlobals(app) {
  const logger = await app.resolve(Logger);
  logger.log = (...args) => logger.logger.info(...args);
  app.useLogger(logger);
  app.register(contentParser);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter(logger));
  app.useGlobalFilters(new MongoValidationExceptionFilter());

  if (config.enableSwagger) {
    const openApiConfig = new DocumentBuilder()
      .setTitle('Campaigns API')
      .setDescription('API serving campaigns and templates')
      .setVersion('1.0')
      .addTag('templates')
      .addTag('heartbeat')
      .addServer('/api-campaigns')
      .addApiKey({ type: 'apiKey', name: 'Authorization', in: 'header' })
      .build();

    const openApiDocument = SwaggerModule.createDocument(app, openApiConfig);
    SwaggerModule.setup('docs/swagger', app, openApiDocument);
  }
}
