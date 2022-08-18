import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage, Bucket } from '@google-cloud/storage';
import axios from 'axios';
import { Stream } from 'stream';

@Injectable()
export class GcpStorageService {
  private readonly storage: Storage;
  private readonly bucket: Bucket;
  private readonly hostname: string;

  constructor(private configService: ConfigService) {
    const { bucket, hostname, apiEndpoint, projectId } =
      this.configService.get('gcp.storage');
    this.hostname = hostname;

    this.storage = new Storage({ apiEndpoint, projectId });
    this.bucket = this.storage.bucket(bucket);
  }

  async streamFromUrl(
    path: string,
    url: string,
    method: string,
    httpOpts?: Record<string, any>,
  ): Promise<{ url: string }> {
    const response = await axios[method]({
      ...httpOpts,
      url,
      responseType: 'stream',
    });

    if (response.status >= 200 && response.status < 300) {
      return this.uploadFromStream(
        response.data,
        path,
        response.headers['content-type'],
      );
    }

    throw new Error('Failed to transfer file');
  }

  uploadFromStream(
    stream: Stream,
    path: string,
    contentType: string,
  ): Promise<{ url: string }> {
    const blob = this.bucket.file(path);

    return new Promise((resolve, reject) => {
      stream.pipe(
        blob
          .createWriteStream({
            resumable: false,
            metadata: {
              contentType,
            },
          })
          .on('finish', () => {
            resolve({
              url: `https://${this.hostname}/${blob.name}`,
            });
          })
          .on('error', (error) => {
            reject(error);
          }),
      );
    });
  }
}
