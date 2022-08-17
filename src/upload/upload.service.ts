import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import * as sharp from 'sharp';
import { GcpStorageService } from '../gcp-storage/gcp-storage.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(
    private gcpStorageService: GcpStorageService,
    private configService: ConfigService,
  ) {}
  async uploadImage(companyId: string, file: Express.Multer.File) {
    const { mimetype, path } = file;

    const { resizeTo } = this.configService.get('uploads.image');

    const resizer = sharp(path).resize(resizeTo).jpeg({ quality: 80 });

    const uploadPath = `${companyId}/uploaded-image/${uuid()}.jpg`;
    return this.gcpStorageService.uploadFromStream(
      resizer,
      uploadPath,
      mimetype,
    );
  }
}
