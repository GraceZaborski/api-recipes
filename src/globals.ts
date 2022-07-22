import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MongoValidationExceptionFilter } from './filters/mongoValidationException.filter';
import { config } from './config/configuration';

export function setupGlobals(app) {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
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
