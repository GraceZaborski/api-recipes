import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { GcpStorageService } from '../gcp-storage/gcp-storage.service';
import { UnlayerInternalExportDto } from './dto/internalExport.dto';
import { UnlayerExportDto } from './dto/unlayer.dto';
import { UnlayerController } from './unlayer.controller';
import { UnlayerService } from './unlayer.service';

jest.mock('uuid', () => ({ v4: jest.fn() }));
import * as uuid from 'uuid';

describe('UnlayerController', () => {
  let controller: UnlayerController;
  let gcpStorageService: GcpStorageService;
  let unlayerService: UnlayerService;

  const apiUrl = 'http://apiurl';
  const apiKey = 'apiKey';
  const externalUrl = 'http://externalurl';
  const previewImage = {
    foo: 'bar',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnlayerController],
      providers: [
        {
          provide: GcpStorageService,
          useValue: {
            streamFromUrl: jest.fn(() => ({
              url: '',
            })),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((arg) => {
              switch (arg) {
                case 'unlayer':
                  return {
                    apiUrl,
                    apiKey,
                    previewImage,
                  };

                case 'externalUrl':
                  return externalUrl;
              }
            }),
          },
        },
        {
          provide: UnlayerService,
          useValue: {
            getCustomJsByCampaignId: jest.fn(),
            getCustomJsByUserCompany: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UnlayerController>(UnlayerController);
    gcpStorageService = module.get<GcpStorageService>(GcpStorageService);
    unlayerService = module.get<UnlayerService>(UnlayerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be able to export', async () => {
    const unlayerExport: UnlayerInternalExportDto = {
      design: { foo: 'bar' },
      displayMode: 'email',
      userId: 'test-userId',
      companyId: 'test-companyId',
    };

    const returnedJson = { foo: 'bar' };

    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(
      jest.fn(async () => ({
        json: jest.fn(() => returnedJson),
      })) as jest.Mock,
    );

    const mockDate = Date.now();
    const dateSpy = jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => mockDate as unknown as number);

    const result = await controller.internalExportHtml(unlayerExport);

    expect(result).toEqual(returnedJson);

    expect(global.fetch).toBeCalledWith(`${apiUrl}/html`, {
      body: JSON.stringify({
        design: unlayerExport.design,
        displayMode: unlayerExport.displayMode,
        customJS: `${externalUrl}/unlayer/public/custom-js/int/${unlayerExport.userId}/${unlayerExport.companyId}/tools.js?${mockDate}`,
      }),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    fetchSpy.mockRestore();
    dateSpy.mockRestore();
  });

  it('should be able to export an image', async () => {
    const unlayerExport: UnlayerExportDto = {
      json: { foo: 'bar' },
    };
    const companyId = 'test-companyId';
    const storageServiceReturn = { url: 'test-url' };
    const testUuid = 'test-uuid';

    const storageSpy = jest
      .spyOn(gcpStorageService, 'streamFromUrl')
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(storageServiceReturn)),
      );

    uuid.v4.mockReturnValue(testUuid);

    const result = await controller.exportImage(unlayerExport, { companyId });

    expect(result).toEqual(storageServiceReturn);

    expect(gcpStorageService.streamFromUrl).toBeCalledWith(
      `${companyId}/export-image/${testUuid}.png`,
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

    storageSpy.mockRestore();
  });

  it('should be able to get custom js by campaignId', async () => {
    const campaignId = 'test-campaignId';
    const js = ['foo', 'bar'];

    const unlayerServiceSpy = jest
      .spyOn(unlayerService, 'getCustomJsByCampaignId')
      .mockReturnValueOnce(new Promise((resolve) => resolve(js)));

    const result = await controller.customJs({ campaignId });

    expect(unlayerService.getCustomJsByCampaignId).toBeCalledWith({
      campaignId,
    });
    expect(result).toEqual(js.join('\n'));

    unlayerServiceSpy.mockRestore();
  });

  it('should be able to get custom js when campaignId = test', async () => {
    const js = ['foo', 'bar'];

    const unlayerServiceSpy = jest
      .spyOn(unlayerService, 'getCustomJsByCampaignId')
      .mockReturnValueOnce(new Promise((resolve) => resolve(js)));

    const result = await controller.customJs({ campaignId: 'test' });

    expect(unlayerService.getCustomJsByCampaignId).toBeCalledWith({
      campaignId: null,
    });
    expect(result).toEqual(js.join('\n'));

    unlayerServiceSpy.mockRestore();
  });

  it('should be able to get custom js by userId and companyId', async () => {
    const userId = 'test-userId';
    const companyId = 'test-companyId';
    const js = ['foo', 'bar'];

    const unlayerServiceSpy = jest
      .spyOn(unlayerService, 'getCustomJsByUserCompany')
      .mockReturnValueOnce(new Promise((resolve) => resolve(js)));

    const result = await controller.customJsUserCompany({ userId, companyId });

    expect(unlayerService.getCustomJsByUserCompany).toBeCalledWith({
      userId,
      companyId,
    });
    expect(result).toEqual(js.join('\n'));

    unlayerServiceSpy.mockRestore();
  });
});
