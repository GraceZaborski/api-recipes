import { ACL, AuthContext } from '@cerbero/mod-auth';
import { Body, Controller, Post } from '@nestjs/common';
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

@ApiTags('unlayer')
@ApiSecurity('api_key')
@Controller('unlayer')
export class UnlayerController {
  private unlayerConfig: {
    apiUrl: string;
    apiKey: string;
    previewImage: Record<string, string>;
  };

  constructor(
    private gcpStorageService: GcpStorageService,
    private configService: ConfigService,
  ) {
    this.unlayerConfig = this.configService.get('unlayer');
  }

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
}
