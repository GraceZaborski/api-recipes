import { Catch, ConflictException, ExceptionFilter } from '@nestjs/common';
import { MongoServerError } from 'mongodb';
@Catch(MongoServerError)
export class MongoValidationExceptionFilter implements ExceptionFilter {
  catch(exception: MongoServerError) {
    if (exception.code === 11000) {
      const keys = Object.keys(exception.keyPattern)
        .filter((k) => k !== 'companyId')
        .join(',');
      const message = `The following properties must be unique: ${keys}`;

      throw new ConflictException(message);
    }

    throw exception;
  }
}
