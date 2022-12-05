import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Logger } from '../logger';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<FastifyReply>();
    const logLevel = exception.getStatus() >= 500 ? 'error' : 'info';
    this.logger[logLevel](exception.message, exception);

    response.status(exception.getStatus()).send(exception);
  }
}
