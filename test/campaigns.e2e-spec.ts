import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@cerbero/mod-auth';
import { rootMongooseTestModule } from './utils/mongooseTest';
import { Chance } from 'chance';
import { CampaignsModule } from '../src/campaigns/campaigns.module';
import { CampaignSchema } from '../src/campaigns/schemas/campaign.schema';
import {
  stubAuthUserResponse,
  buildXTokenPayload,
  authStub,
  authSandbox,
} from './utils/authUtils';
import { userStub, userSandbox, stubUserResponse } from './utils/userUtils';
import { proto } from '@beamery/chimera-auth-client';
import { proto as userProto } from '@beamery/chimera-user-client';
import { setupGlobals } from '../src/globals';
import { ConfigModule } from '@nestjs/config';
import configuration from '../src/config/configuration';
import { LoggerModule } from '../src/logger';
import { generateCampaign } from '../src/campaigns/campaigns.service.spec';

const chance = new Chance();

const companyId = 'test-company-id';
const userId = 'test-user-id';
const roles = ['super_admin'];
const ABILITIES = {
  CAMPAIGNS_LIST: 'campaigns/campaign:view',
  CAMPAIGNS_LIST_ALL: 'campaigns/campaign:view_all',
};

describe('CampaignsController (e2e)', () => {
  let app: NestFastifyApplication;
  let headersWithToken;

  const clearCampaigns = async () => {
    const campaigns = app.get(getModelToken('Campaign', 'seed'));
    await campaigns.deleteMany();
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
        CampaignsModule,
        rootMongooseTestModule('seed'),
        MongooseModule.forFeature(
          [{ name: 'campaigns', schema: CampaignSchema }],
          'seed',
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
  });

  afterAll(async () => {
    await clearCampaigns();
    await app.close();
    authSandbox.restore();
    userSandbox.restore();
  });

  it('should return 403 without the correct permissions', async () => {
    stubAuthUserResponse({ abilities: [] });
    const response = await app.inject({
      method: 'GET',
      url: '/campaigns',
      headers: headersWithToken,
    });

    expect(response.statusCode).toEqual(403);
  });

  it('should return no campaigns initially', async () => {
    stubAuthUserResponse({ abilities: [ABILITIES.CAMPAIGNS_LIST] });
    const firstName = chance.first();
    const lastName = chance.last();

    stubUserResponse({
      id: 'test',
      firstName,
      lastName,
    });

    const response = await app.inject({
      method: 'GET',
      url: '/campaigns',
      headers: headersWithToken,
    });

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      results: [],
      count: 0,
      limit: 20,
      offset: 0,
    });
  });

  it('should return one campaign as list', async () => {
    stubAuthUserResponse({ abilities: [ABILITIES.CAMPAIGNS_LIST] });
    const firstName = chance.first();
    const lastName = chance.last();

    stubUserResponse({
      id: 'test',
      firstName,
      lastName,
    });

    const campaigns = app.get(getModelToken('Campaign', 'seed'));
    const newCampaign = generateCampaign(companyId, userId);
    await campaigns.insertMany([{ ...newCampaign }]);

    const response = await app.inject({
      method: 'GET',
      url: '/campaigns',
      headers: headersWithToken,
    });

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      results: [
        {
          ...newCampaign,
          touchpoints: 1,
          totalRecipients: 0,
          user: { id: userId, name: `${firstName} ${lastName}` },
        },
      ],
      count: 1,
      limit: 20,
      offset: 0,
    });
  });

  it('should return multiple campaigns', async () => {
    stubAuthUserResponse({ abilities: [ABILITIES.CAMPAIGNS_LIST] });
    const firstName = chance.first();
    const lastName = chance.last();

    stubUserResponse({
      id: 'test',
      firstName,
      lastName,
    });

    const campaigns = app.get(getModelToken('Campaign', 'seed'));
    const newCampaign = generateCampaign(companyId, userId);
    await campaigns.insertMany([{ ...newCampaign }]);

    const response = await app.inject({
      method: 'GET',
      url: '/campaigns',
      headers: headersWithToken,
    });

    expect(response.statusCode).toEqual(200);
    expect(response.json().count).toBe(2);
  });

  it('should return campaigns with status filter applied', async () => {
    stubAuthUserResponse({ abilities: [ABILITIES.CAMPAIGNS_LIST] });
    const firstName = chance.first();
    const lastName = chance.last();

    stubUserResponse({
      id: 'test',
      firstName,
      lastName,
    });

    const campaigns = app.get(getModelToken('Campaign', 'seed'));
    const newCampaign = generateCampaign(companyId, userId, 'complete');
    await campaigns.insertMany([{ ...newCampaign }]);

    const response = await app.inject({
      method: 'GET',
      url: '/campaigns',
      headers: headersWithToken,
      query: { status: 'complete' },
    });

    expect(response.statusCode).toEqual(200);
    expect(response.json().count).toBe(1);
    expect(response.json().results[0].status).toBe('complete');
  });

  it('should return campaigns with type and status filters applied', async () => {
    stubAuthUserResponse({ abilities: [ABILITIES.CAMPAIGNS_LIST] });
    const firstName = chance.first();
    const lastName = chance.last();

    stubUserResponse({
      id: 'test',
      firstName,
      lastName,
    });

    const campaigns = app.get(getModelToken('Campaign', 'seed'));
    const newCampaign = generateCampaign(
      companyId,
      userId,
      'complete',
      null,
      null,
      2,
      null,
      'dynamic',
    );
    await campaigns.insertMany([{ ...newCampaign }]);
    const response = await app.inject({
      method: 'GET',
      url: '/campaigns',
      headers: headersWithToken,
      query: { status: 'complete', type: 'dynamic' },
    });

    expect(response.statusCode).toEqual(200);
    expect(response.json().count).toBe(1);
    expect(response.json().results[0].status).toBe('complete');
    expect(response.json().results[0].type).toBe('dynamic');
  });

  it('should return campaigns with title filter applied', async () => {
    stubAuthUserResponse({ abilities: [ABILITIES.CAMPAIGNS_LIST] });
    const firstName = chance.first();
    const lastName = chance.last();

    stubUserResponse({
      id: 'test',
      firstName,
      lastName,
    });

    const campaigns = app.get(getModelToken('Campaign', 'seed'));
    const newCampaign = generateCampaign(
      companyId,
      userId,
      'complete',
      null,
      null,
      2,
      null,
      'dynamic',
      'The Quick Brown Fox Ate A Panda Toy',
    );
    await campaigns.insertMany([{ ...newCampaign }]);

    const response = await app.inject({
      method: 'GET',
      url: '/campaigns',
      headers: headersWithToken,
      query: { title: 'panda' },
    });

    expect(response.statusCode).toEqual(200);
    expect(response.json().count).toBe(1);
  });

  it('should return empty campaigns when title do not match', async () => {
    stubAuthUserResponse({ abilities: [ABILITIES.CAMPAIGNS_LIST] });
    const firstName = chance.first();
    const lastName = chance.last();

    stubUserResponse({
      id: 'test',
      firstName,
      lastName,
    });

    const campaigns = app.get(getModelToken('Campaign', 'seed'));
    const newCampaign = generateCampaign(
      companyId,
      userId,
      'complete',
      null,
      null,
      2,
      null,
      'dynamic',
      'The Quick Brown Fox Ate A Panda',
    );
    await campaigns.insertMany([{ ...newCampaign }]);

    const response = await app.inject({
      method: 'GET',
      url: '/campaigns',
      headers: headersWithToken,
      query: { title: 'pandass' },
    });

    expect(response.statusCode).toEqual(200);
    expect(response.json().count).toBe(0);
  });

  it('should return campaigns which falls on the filtered createdOn', async () => {
    stubAuthUserResponse({ abilities: [ABILITIES.CAMPAIGNS_LIST] });
    const firstName = chance.first();
    const lastName = chance.last();

    stubUserResponse({
      id: 'test',
      firstName,
      lastName,
    });

    const campaigns = app.get(getModelToken('Campaign', 'seed'));
    const newCampaign = generateCampaign(
      companyId,
      userId,
      'complete',
      null,
      new Date('1/1/2012'),
      2,
      null,
      'dynamic',
      'The Quick Brown Fox Ate A Panda',
    );
    await campaigns.insertMany([{ ...newCampaign }]);
    const response = await app.inject({
      method: 'GET',
      url: '/campaigns',
      headers: headersWithToken,
      query: { createdOn: '2011-12-31' },
    });

    expect(response.statusCode).toEqual(200);
    expect(response.json().count).toBe(1);
  });
});
