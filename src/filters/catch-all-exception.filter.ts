import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Logger } from '../logger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<FastifyReply>();
    const isHttpException = exception instanceof HttpException;

    const httpStatus: number = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const logLevel =
      httpStatus >= 500 ? 'error' : httpStatus >= 400 ? 'warn' : 'info';

    this.logger[logLevel]({
      message: exception.stack,
    });

    const responseBody = isHttpException
      ? exception
      : {
          statusCode: httpStatus,
          message: 'Unspecified error',
          error: 'Unspecified error',
        };

    response.status(httpStatus).send({
      ...responseBody,
      traceId: response.request.headers['x-b3-traceid'],
    });
  }
}
