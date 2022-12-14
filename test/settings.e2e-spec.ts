import { AuthModule } from '@cerbero/mod-auth';
import { ConfigModule } from '@nestjs/config';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import configuration from '../src/config/configuration';
import { LoggerModule } from '../src/logger';
import { SettingsSchema } from '../src/settings/schemas/settings.schema';
import {
  authSandbox,
  authStub,
  buildXTokenPayload,
  stubAuthUserResponse,
} from './utils/authUtils';
import { rootMongooseTestModule } from './utils/mongooseTest';
import { proto } from '@beamery/chimera-auth-client';
import { proto as userProto } from '@beamery/chimera-user-client';
import { userSandbox, userStub } from './utils/userUtils';
import { setupGlobals } from '../src/globals';
import { settingsDefaultData } from '../src/settings/default-data/settings-default-data';
import { SettingsModule } from '../src/settings/settings.module';
import { mockUpdatePayload } from '../src/settings/mock-update-payload';

const companyId = 'test-company-id';
const userId = 'test-user-id';
const roles = ['super_admin'];
const SETTINGS_EDIT_ABILITY = 'templates/template:edit';

describe('SettingsController (e2e)', () => {
  let app: NestFastifyApplication;
  let headersWithToken;

  const clearSettings = async () => {
    const campaigns = app.get(getModelToken('Settings', 'campaigns'));
    await campaigns.deleteMany({});
  };

  beforeAll(async () => {
    headersWithToken = {
      'x-token-payload': buildXTokenPayload({ companyId, userId, roles }),
    };

    const config = configuration();
    config.logLevel = 'error';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule,
        SettingsModule,
        rootMongooseTestModule('campaigns'),
        rootMongooseTestModule('seed'),
        MongooseModule.forFeature(
          [{ name: 'Settings', schema: SettingsSchema }],
          'campaigns',
        ),
        AuthModule.forRoot(),
        ConfigModule.forRoot({
          load: [() => configuration()],
          isGlobal: true,
        }),
      ],
    })
      .overrideProvider(proto.Auth)
      .useValue(authStub)
      .overrideProvider(userProto.User)
      .useValue(userStub)
      .compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    setupGlobals(app, { useLogger: false });

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    await clearSettings();
  });

  afterAll(async () => {
    await clearSettings();
    await app.close();
    authSandbox.restore();
    userSandbox.restore();
  });

  it('should return 403 without the correct permissions', async () => {
    stubAuthUserResponse({ abilities: [] });
    const response = await app.inject({
      method: 'PUT',
      url: '/settings',
      headers: headersWithToken,
    });

    expect(response.statusCode).toEqual(403);
  });

  it('should return 403 without the correct token header', async () => {
    stubAuthUserResponse({ abilities: [] });
    const response = await app.inject({
      method: 'PUT',
      url: '/settings',
    });

    expect(response.statusCode).toEqual(403);
  });

  it('should return the default data when a document does not exist', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/settings',
      headers: headersWithToken,
    });

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual(settingsDefaultData);
  });

  it('should return the default data when undefined is used in payload for optional properties', async () => {
    stubAuthUserResponse({ abilities: [SETTINGS_EDIT_ABILITY] });
    const createResponse = await app.inject({
      method: 'PUT',
      payload: mockUpdatePayload,
      url: '/settings',
      headers: headersWithToken,
    });

    expect(createResponse.statusCode).toEqual(200);
    expect(Object.keys(createResponse.json())).toEqual(
      expect.arrayContaining([
        'colours',
        'backgroundColour',
        'fonts',
        'defaultFont',
        'contentTools',
        'companyId',
        'updatedAt',
        'updatedBy',
      ]),
    );

    expect(createResponse.json()).toEqual(
      expect.objectContaining({
        defaultFont: settingsDefaultData.defaultFont,
        backgroundColour: null,
        companyId,
        updatedBy: userId,
      }),
    );
  });

  it('should return the correct document data', async () => {
    stubAuthUserResponse({ abilities: [SETTINGS_EDIT_ABILITY] });

    const createResponse = await app.inject({
      method: 'PUT',
      payload: mockUpdatePayload,
      url: '/settings',
      headers: headersWithToken,
    });

    expect(createResponse.statusCode).toEqual(200);

    const fetchResponse = await app.inject({
      method: 'GET',
      url: '/settings',
      headers: headersWithToken,
    });

    expect(fetchResponse.statusCode).toEqual(200);

    expect(Object.keys(fetchResponse.json())).toEqual(
      expect.arrayContaining([
        'colours',
        'backgroundColour',
        'fonts',
        'defaultFont',
        'contentTools',
        'companyId',
        'updatedAt',
        'updatedBy',
      ]),
    );

    expect(fetchResponse.json()).toEqual(
      expect.objectContaining({
        ...settingsDefaultData,
        backgroundColour: null,
        companyId,
        updatedBy: userId,
      }),
    );
  });

  it('should create and update the existing document data correctly when using the updateOne service', async () => {
    stubAuthUserResponse({ abilities: [SETTINGS_EDIT_ABILITY] });

    const updateSettingsDto = {
      ...mockUpdatePayload,
      colours: [
        { colour: '#ffffff' },
        { colour: '#ffffff' },
        { colour: '#000000' },
        { colour: '#hijk' },
      ],
      backgroundColour: '#ffffff',
    };

    const createResponse = await app.inject({
      method: 'PUT',
      payload: updateSettingsDto,
      url: '/settings',
      headers: headersWithToken,
    });

    expect(createResponse.statusCode).toEqual(200);
    expect(Object.keys(createResponse.json())).toEqual(
      expect.arrayContaining([
        'colours',
        'backgroundColour',
        'fonts',
        'defaultFont',
        'contentTools',
        'companyId',
        'updatedAt',
        'updatedBy',
      ]),
    );

    // excluded updatedAt as cannot mock date global which is failing test
    expect(createResponse.json()).toEqual(
      expect.objectContaining({
        ...updateSettingsDto,
        colours: [updateSettingsDto.colours[1], updateSettingsDto.colours[2]],
        companyId,
        updatedBy: userId,
      }),
    );

    const updateSettingsDto2 = {
      ...mockUpdatePayload,
      colours: [{ colour: '#123456' }],
      backgroundColour: '#123',
    };

    const updateResponse = await app.inject({
      method: 'PUT',
      payload: updateSettingsDto2,
      url: '/settings',
      headers: headersWithToken,
    });

    expect(updateResponse.statusCode).toEqual(200);
    expect(Object.keys(updateResponse.json())).toEqual(
      expect.arrayContaining([
        'colours',
        'backgroundColour',
        'fonts',
        'defaultFont',
        'contentTools',
        'companyId',
        'updatedAt',
        'updatedBy',
      ]),
    );

    expect(updateResponse.json()).toEqual(
      expect.objectContaining({
        ...updateSettingsDto2,
        backgroundColour: null,
        companyId,
        updatedBy: userId,
      }),
    );
  });

  it('should return 400 for malformed payloads', async () => {
    stubAuthUserResponse({ abilities: [SETTINGS_EDIT_ABILITY] });

    const updateSettingsDtoMissingProperties = {
      ...mockUpdatePayload.colours,
    };

    let createResponse = await app.inject({
      method: 'PUT',
      payload: updateSettingsDtoMissingProperties,
      url: '/settings',
      headers: headersWithToken,
    });

    expect(createResponse.statusCode).toEqual(400);

    const updateSettingsDtoIncorrectProperties = {
      ...mockUpdatePayload,
      colours: ['#ffffff'],
    };

    createResponse = await app.inject({
      method: 'PUT',
      payload: updateSettingsDtoIncorrectProperties,
      url: '/settings',
      headers: headersWithToken,
    });

    expect(createResponse.statusCode).toEqual(400);

    createResponse = await app.inject({
      method: 'PUT',
      payload: mockUpdatePayload,
      url: '/settings',
      headers: headersWithToken,
    });

    expect(createResponse.statusCode).toEqual(200);
  });
});
