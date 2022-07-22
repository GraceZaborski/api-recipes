import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('heartbeat')
@Controller('heartbeat')
export class HeartbeatController {
  @Get('readiness')
  readiness(@Res() res: Response): void {
    res.status(HttpStatus.OK).send();
  }

  @Get('liveness')
  liveness(@Res() res: Response): void {
    res.status(HttpStatus.OK).send();
  }
}
