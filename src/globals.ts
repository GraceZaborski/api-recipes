import { MongoValidationExceptionFilter } from './filters/mongoValidationException.filter';
import { ValidationPipe } from '@nestjs/common';

export function setupGlobals(app) {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new MongoValidationExceptionFilter());
}
