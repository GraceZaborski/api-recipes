import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage, Bucket } from '@google-cloud/storage';
// import { request } from 'gaxios';
import * as request from 'request';
import { pipeline } from 'node:stream/promises';
const abortController = new AbortController();

@Injectable()
export class GcpStorageService {
  private readonly storage: Storage;
  private readonly bucket: Bucket;
  private readonly hostname: string;
  private readonly protocol: 'http' | 'https' = 'https';

  constructor(private configService: ConfigService) {
    const { bucket, hostname, apiEndpoint, projectId, protocol } =
      this.configService.get('gcp.storage');
    this.hostname = hostname;
    this.protocol = protocol;

    this.storage = new Storage({ apiEndpoint, projectId });
    this.bucket = this.storage.bucket(bucket);
  }

  async streamFromUrl(
    path: string,
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    httpOpts?: Record<string, any>,
  ): Promise<{ url: string }> {
    try {
      // const response = await request<Readable>({
      //   headers: httpOpts?.headers,
      //   data: httpOpts?.data,
      //   signal: abortController.signal,
      //   url,
      //   method,
      //   responseType: 'stream',
      // });

      const response = request[`${method.toLowerCase()}`]({
        headers: httpOpts?.headers,
        url,
        json: httpOpts?.data,
      });

      response.on('close', () => {
        console.log('closing request');
      });

      response.on('error', (err) => {
        console.log('STREAM ERRORED', err);
      });

      // if (response.status >= 200 && response.status < 300) {
      return this.uploadFromStream(
        response,
        path,
        response.headers['content-type'],
      );
      // }
    } catch (error) {
      console.error(error);
      throw error;
    }

    throw new Error('Failed to transfer file');
  }

  async uploadFromStream(
    stream,
    path: string,
    contentType: string,
  ): Promise<{ url: string }> {
    const blob = this.bucket.file(path);
    const writeStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType,
      },
    });

    await pipeline(stream, writeStream);

    stream.destroy();
    stream.end();
    writeStream.end();
    writeStream.destroy();
    abortController.abort();

    return { url: `${this.protocol}://${this.hostname}/${blob.name}` };
  }
}
