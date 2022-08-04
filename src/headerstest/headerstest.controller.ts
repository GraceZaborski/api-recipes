import { Controller, Get, Headers } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('headetrstest')
@Controller('docs')
export class HeaderstestController {
  @Get('swagger/test')
  readiness(@Headers() headers: Record<string, string>): {
    headers: Record<string, string>;
  } {
    return {
      headers,
    };
  }
}
