import { Catch, ConflictException, ExceptionFilter } from '@nestjs/common';
import { MongoServerError } from 'mongodb';
@Catch(MongoServerError)
export class MongoValidationExceptionFilter implements ExceptionFilter {
  catch(exception: MongoServerError) {
    if (exception.code === 11000) {
      throw new ConflictException(exception.message);
    }

    throw exception;
  }
}
