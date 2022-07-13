import { Controller, Get } from '@nestjs/common';
import { Logger } from './logger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: Logger,
  ) {}

  @Get()
  getHello(): string {
    this.logger.info('hello world');
    return this.appService.getHello();
  }
}
