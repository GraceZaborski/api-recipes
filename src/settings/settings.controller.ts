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
import { settingsDefaultData } from './default-data/settings-default-data';
import { unlayerContentTools } from './default-data/unlayer-content-tools';
import { unlayerSettingsFonts } from './default-data/unlayer-system-fonts';
import { SettingsService } from './settings.service';
import { isColourValidHexCode } from './utils/is-colour-valid-hex-code';

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
  ): Promise<SettingsDto | Error> {
    const companySettings = await this.settingsService.findOne(companyId);
    if (!companySettings) return settingsDefaultData;
    return companySettings;
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
  ): Promise<SettingsDto | Error> {
    // colours
    const { colours } = settingsDto;

    const colourValuesArray = colours.map((colour) => colour.colour);
    const filteredArray = colours.filter(
      ({ colour }, index) =>
        !colourValuesArray.includes(colour, index + 1) &&
        isColourValidHexCode(colour),
    );

    // contentTools
    const { contentTools: updatedTools } = settingsDto;

    const combinedTools = updatedTools.concat(unlayerContentTools);

    const uniqueTools = [];

    const filteredTools = combinedTools.filter((element) => {
      const isDuplicate = uniqueTools.includes(element.tool);

      if (!isDuplicate) {
        uniqueTools.push(element.tool);

        return true;
      }

      return false;
    });

    //fonts
    const { fonts: updatedFonts } = settingsDto;

    const combinedFonts = updatedFonts.concat(unlayerSettingsFonts);

    const uniqueFonts = [];

    const filteredFonts = combinedFonts.filter((element) => {
      const isDuplicate = uniqueFonts.includes(element.label);

      if (!isDuplicate) {
        uniqueFonts.push(element.label);

        return true;
      }

      return false;
    });

    const payload = {
      ...settingsDto,
      colours: filteredArray,
      contentTools: filteredTools,
      fonts: filteredFonts,
      companyId,
      updatedBy,
      updatedAt: new Date(),
    };
    return this.settingsService.updateOne(companyId, payload);
  }
}
