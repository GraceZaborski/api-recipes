import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { GcpStorageService } from './gcp-storage.service';
import { PassThrough } from 'stream';
import * as gcs from '@google-cloud/storage';
import axios from 'axios';

describe('GcpStorageService', () => {
  let service: GcpStorageService;
  let mockFile: any;
  let mockBucket: any;
  let mockStorage: any;
  let mockAxios;
  let mockedStream;

  const name = 'name';
  const bucket = 'bucket';
  const hostname = 'hostname';

  beforeAll(() => {
    mockFile = {
      createWriteStream: jest.fn(() => mockedStream),
      name: name,
    };

    mockBucket = {
      file: jest.fn(() => mockFile),
    };

    mockStorage = {
      bucket: jest.fn(() => mockBucket),
    };

    const storageMock = jest.spyOn(gcs, 'Storage');
    storageMock.mockImplementation(() => mockStorage);

    mockAxios = jest.spyOn(axios, 'post');
  });

  beforeEach(async () => {
    mockedStream = new PassThrough();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GcpStorageService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => ({
              bucket,
              hostname,
            })),
          },
        },
      ],
    }).compile();

    service = module.get<GcpStorageService>(GcpStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to upload a file', async () => {
    const path = 'path';
    const url = 'url';
    const method = 'post';
    const httpOpts = { foo: 'bar' };
    const contentType = 'image/png';

    mockAxios.mockResolvedValueOnce({
      status: 200,
      headers: {
        'content-type': contentType,
      },
      data: {
        pipe: jest.fn(() => new PassThrough()),
      },
    });

    mockedStream.emit('finish');
    mockedStream.end();
    const result = await service.streamFromUrl(path, url, method, httpOpts);

    expect(mockFile.createWriteStream).toHaveBeenCalledWith({
      resumable: false,
      metadata: { contentType },
    });

    expect(result.url).toEqual('https://hostname/name');
  });

  it('should throw an exception if the upload fails', async () => {
    const path = 'path';
    const url = 'url';
    const method = 'post';
    const httpOpts = { foo: 'bar' };
    const contentType = 'image/png';

    mockAxios.mockResolvedValueOnce({
      status: 500,
      headers: {
        'content-type': contentType,
      },
      data: {
        pipe: jest.fn(() => new PassThrough()),
      },
    });

    mockedStream.emit('finish');
    mockedStream.end();
    await expect(
      service.streamFromUrl(path, url, method, httpOpts),
    ).rejects.toThrow();
  });
});
