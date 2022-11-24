import { ACL, AuthContext } from '@cerbero/mod-auth';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
} from '@nestjs/common';
import { GcpStorageService } from '../gcp-storage/gcp-storage.service';
import { UnlayerExportDto } from './dto/unlayer.dto';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { UnlayerExportImageResponseDto } from './dto/exportImageResponse.dto';
import { ErrorResponseDto } from '../common/dto/errorResponse.dto';
import { UnlayerService } from './unlayer.service';
import { UnlayerInternalExportDto } from './dto/internalExport.dto';
@ApiTags('unlayer')
@Controller('unlayer')
export class UnlayerController {
  private unlayerConfig: {
    apiUrl: string;
    apiKey: string;
    previewImage: Record<string, string>;
  };

  private externalUrl: string;

  constructor(
    private gcpStorageService: GcpStorageService,
    private configService: ConfigService,
    private unlayerService: UnlayerService,
  ) {
    this.unlayerConfig = this.configService.get('unlayer');
    this.externalUrl = this.configService.get('externalUrl');
  }

  @Post('/internal/export/html')
  async internalExportHtml(@Body() unlayerExport: UnlayerInternalExportDto) {
    const {
      userId,
      companyId,
      campaignId,
      design,
      displayMode = 'email',
    } = unlayerExport;
    const { apiUrl, apiKey } = this.unlayerConfig;

    if ((!userId || !companyId) && !campaignId) {
      throw new BadRequestException(
        'Must supply userId and companyId, or campaignId',
      );
    }

    const customJS = campaignId
      ? `${
          this.externalUrl
        }/unlayer/public/custom-js/${campaignId}/tools.js?${Date.now()}`
      : `${
          this.externalUrl
        }/unlayer/public/custom-js/int/${userId}/${companyId}/tools.js?${Date.now()}`;

    const response = await fetch(`${apiUrl}/html`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        design,
        displayMode,
        customJS,
      }),
    });

    return response.json();
  }

  @ApiSecurity('api_key')
  @Post('/export/image')
  @ACL('templates/template:create')
  @ApiOkResponse({ type: UnlayerExportImageResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  async exportImage(
    @Body() unlayerExport: UnlayerExportDto,
    @AuthContext() { companyId },
  ): Promise<UnlayerExportImageResponseDto> {
    const { apiUrl, apiKey, previewImage } = this.unlayerConfig;
    const { url } = await this.gcpStorageService.streamFromUrl(
      `${companyId}/export-image/${uuid()}.png`,
      `${apiUrl}/image`,
      'POST',
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        data: {
          ...previewImage,
          design: unlayerExport.json,
        },
      },
    );

    return { url };
  }

  @Get('/public/custom-js/:campaignId/tools.js')
  @Header('Content-Type', 'text/javascript')
  @Header('Cache-Control', 'max-age=30')
  async customJs(@Param() { campaignId }) {
    const id = campaignId === 'test' ? null : campaignId;
    return (
      await this.unlayerService.getCustomJsByCampaignId({ campaignId: id })
    ).join('\n');
  }

  @Get('/public/custom-js/int/:userId/:companyId/tools.js')
  @Header('Content-Type', 'text/javascript')
  @Header('Cache-Control', 'max-age=30')
  async customJsUserCompany(@Param() { userId, companyId }) {
    return (
      await this.unlayerService.getCustomJsByUserCompany({ userId, companyId })
    ).join('\n');
  }

  @ApiSecurity('api_key')
  @Get('/custom-js/unsubscribe-html')
  @ACL('campaigns/campaign:create')
  async unsubscribeHtml(@AuthContext() { companyId }) {
    const unsubscribeHtml = await this.unlayerService.getUnsubscribeHtml({
      companyId,
    });

    return { unsubscribeHtml };
  }
}
