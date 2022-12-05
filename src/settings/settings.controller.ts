import { ACL, AuthContext } from '@cerbero/mod-auth';
import { Controller, Get } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/errorResponse.dto';
import { Logger } from '../logger';
import { SettingsDto } from '../templates/dto/settings.dto';
import { Settings } from './schemas/settings.schema';
import { SettingsService } from './settings.service';

@ApiTags('settings')
@ApiSecurity('api_key')
@Controller('settings')
export class SettingsController {
  constructor(
    private settingsService: SettingsService,
    private logger: Logger,
  ) {
    this.logger.setContext('SettingsController');
  }

  @Get()
  // TODO: change permissions once available in platform-core
  @ACL('templates/template:view')
  @ApiOkResponse({ type: SettingsDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  public async getSettings(
    @AuthContext() { companyId },
  ): Promise<Settings | Error> {
    return this.settingsService.findAll(companyId);
  }
}
