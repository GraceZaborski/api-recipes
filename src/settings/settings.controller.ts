import { AuthContext } from '@cerbero/mod-auth';
import {
  Body,
  Controller,
  Get,
  Put,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/errorResponse.dto';
import { TransformInterceptor } from '../interceptors/classTransformer.interceptor';
import { Logger } from '../logger';
import { SettingsDto, UpdateSettingsDto } from '../templates/dto/settings.dto';
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
  @ApiOkResponse({ type: SettingsDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  public async getSettings(
    @AuthContext() { companyId },
  ): Promise<Settings | Error> {
    return this.settingsService.findOne(companyId);
  }

  @Put()
  // TODO: change permissions once available in platform-core
  @ApiOkResponse({ type: SettingsDto })
  @UseInterceptors(new TransformInterceptor(SettingsDto))
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  public async updateSettings(
    @Body() settingsDto: UpdateSettingsDto,
    @AuthContext() { userId: updatedBy, companyId },
  ): Promise<Settings | Error> {
    const payload = {
      ...settingsDto,
      companyId,
      updatedBy,
      updatedAt: new Date(),
    };
    return this.settingsService.updateOne(companyId, payload);
  }
}
