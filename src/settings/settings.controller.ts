import { ACL, AuthContext } from '@cerbero/mod-auth';
import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  UseInterceptors,
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
import { settingsDefaultData } from './default-data/settings-default-data';
import { SettingsService } from './settings.service';
import { filterColours, isColourValidHexCode } from './utils/filter-colours';

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
  @ApiOkResponse({ type: SettingsDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  public async getSettings(
    @AuthContext() { companyId },
  ): Promise<SettingsDto | Error> {
    const companySettings = await this.settingsService.findOne(companyId);
    if (!companySettings) return settingsDefaultData;
    return companySettings;
  }

  @Put()
  @ACL('templates/template:edit')
  @ApiOkResponse({ type: SettingsDto })
  @UseInterceptors(new TransformInterceptor(SettingsDto))
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  public async updateSettings(
    @Body() settingsDto: UpdateSettingsDto,
    @AuthContext() { userId: updatedBy, companyId },
  ): Promise<SettingsDto | Error> {
    const { colours, backgroundColour } = settingsDto;

    const filteredColours = filterColours(colours);

    const validBackgroundColour = isColourValidHexCode(backgroundColour)
      ? backgroundColour
      : null;

    const payload = {
      ...settingsDto,
      colours: filteredColours,
      backgroundColour: validBackgroundColour,
      companyId,
      updatedBy,
      updatedAt: new Date(),
    };
    return this.settingsService.updateOne(companyId, payload);
  }

  // for testing
  @Delete()
  @ApiOkResponse({ type: SettingsDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  public async deleteSettings(
    @AuthContext() { companyId },
  ): Promise<SettingsDto | Error> {
    return this.settingsService.deleteOne(companyId);
  }
}
