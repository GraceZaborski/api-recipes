import { Catch, ConflictException, ExceptionFilter } from '@nestjs/common';
import { ValidationError } from 'mongoose/lib/error/validation';

@Catch(ValidationError)
export class MongoValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationError) {
    throw new ConflictException(exception.message);
  }
}
