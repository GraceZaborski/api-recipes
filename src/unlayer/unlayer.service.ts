import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GcpStorageService } from '../gcp-storage/gcp-storage.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UnlayerService {
  private unlayerConfig: {
    apiUrl: string;
    apiKey: string;
    previewImage: Record<string, string>;
  };

  constructor(
    private configService: ConfigService,
    private gcpStorageService: GcpStorageService,
  ) {
    this.unlayerConfig = this.configService.get('unlayer');
  }

  public async generatePreviewImage(unlayerExport, companyId) {
    const { apiUrl, apiKey, previewImage } = this.unlayerConfig;
    const { url } = await this.gcpStorageService.streamFromUrl(
      `${companyId}/export-image/${uuid()}.png`,
      `${apiUrl}/image`,
      'POST',
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Connection: 'close',
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
