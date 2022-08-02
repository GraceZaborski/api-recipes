import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@cerbero/mod-auth';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from './utils/mongooseTest';
import { Chance } from 'chance';
import { TemplatesModule } from '../src/templates/templates.module';
import { TemplateSchema } from '../src/templates/schemas/template.schema';
import {
  stubAuthUserResponse,
  buildXTokenPayload,
  authSandbox,
  sandbox,
} from './utils/authUtils';

import { proto } from '@beamery/chimera-auth-client';
import { setupGlobals } from '../src/globals';

const chance = new Chance();

const companyId = 'test-company-id';
const userId = 'test-user-id';
const roles = ['super_admin'];
const ABILITIES = {
  TEMPLATE_CREATE: 'templates/template:create',
  TEMPLATE_VIEW: 'templates/template:view',
};

const newTemplate = {
  title: chance.sentence(),
  subject: chance.sentence(),
  recipientVariables: [],
  unlayer: {
    json: { foo: 'bar' },
    previewUrl: chance.url(),
  },
};

const allTemplatesResponse = {
  results: [],
  count: 0,
  limit: 20,
  offset: 0,
};

describe('TemplatesController (e2e)', () => {
  let app: NestFastifyApplication;
  let headersWithToken;

  beforeAll(async () => {
    headersWithToken = {
      'x-token-payload': buildXTokenPayload({ companyId, userId, roles }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TemplatesModule,
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'Templates', schema: TemplateSchema },
        ]),
        AuthModule.forRoot(),
      ],
    })
      .overrideProvider(proto.Auth)
      .useValue(authSandbox)
      .compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    setupGlobals(app);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await app.close();
    sandbox.restore();
  });

  it('should return 403 without the correct permissions', async () => {
    stubAuthUserResponse({ abilities: [] });
    const response = await app.inject({
      method: 'GET',
      url: '/templates',
      headers: headersWithToken,
    });

    expect(response.statusCode).toEqual(403);
  });

  it('should return 401 without the correct token header', async () => {
    stubAuthUserResponse({ abilities: [] });
    const response = await app.inject({
      method: 'GET',
      url: '/templates',
    });

    expect(response.statusCode).toEqual(403);
  });

  it('should return no templates initially', async () => {
    stubAuthUserResponse({ abilities: [ABILITIES.TEMPLATE_VIEW] });
    const response = await app.inject({
      method: 'GET',
      url: '/templates',
      headers: headersWithToken,
    });

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual(allTemplatesResponse);
  });

  it('should be able to create a template', async () => {
    stubAuthUserResponse({ abilities: [ABILITIES.TEMPLATE_CREATE] });

    const response = await app.inject({
      method: 'POST',
      url: '/templates',
      headers: headersWithToken,
      payload: newTemplate,
    });

    expect(response.statusCode).toEqual(201);
  });

  it('should return the created template', async () => {
    stubAuthUserResponse({ abilities: [ABILITIES.TEMPLATE_VIEW] });
    const response = await app.inject({
      method: 'GET',
      url: '/templates',
      headers: headersWithToken,
    });

    expect(response.statusCode).toEqual(200);
    expect(response.json().results[0]).toEqual(
      expect.objectContaining({
        ...newTemplate,
        companyId,
        createdBy: userId,
      }),
    );

    expect(Object.keys(response.json().results[0])).toEqual([
      'id',
      'title',
      'subject',
      'unlayer',
      'recipientVariables',
      'companyId',
      'createdBy',
      'createdAt',
      'updatedBy',
      'updatedAt',
    ]);
  });

  it('should be able to search title and subject', async () => {
    const TITLE_SEARCH_STRING = chance.word();
    const SUBJECT_SEARCH_STRING = chance.word();

    const searchTemplate = {
      ...newTemplate,
      title: `foo bar ${TITLE_SEARCH_STRING} foo bar`,
      subject: `foo bar ${SUBJECT_SEARCH_STRING} foo bar `,
    };

    stubAuthUserResponse({
      abilities: [ABILITIES.TEMPLATE_CREATE, ABILITIES.TEMPLATE_VIEW],
    });
    const create = await app.inject({
      method: 'POST',
      url: '/templates',
      headers: headersWithToken,
      payload: searchTemplate,
    });

    expect(create.statusCode).toEqual(201);
    const { id: searchTemplateId } = create.json();

    const searchTitle = await app.inject({
      method: 'GET',
      url: '/templates',
      query: { search: TITLE_SEARCH_STRING },
      headers: headersWithToken,
    });

    const [searchTitleTemplate] = searchTitle.json().results;
    expect(searchTitle.statusCode).toEqual(200);
    expect(searchTitle.json().results.length).toEqual(1);
    expect(searchTitleTemplate.id).toEqual(searchTemplateId);
    expect(searchTitleTemplate.title).toEqual(searchTemplate.title);

    const searchSubject = await app.inject({
      method: 'GET',
      url: '/templates',
      query: { search: SUBJECT_SEARCH_STRING },
      headers: headersWithToken,
    });

    const [searchSubjectTemplate] = searchSubject.json().results;
    expect(searchSubject.statusCode).toEqual(200);
    expect(searchSubject.json().results.length).toEqual(1);
    expect(searchSubjectTemplate.id).toEqual(searchTemplateId);
    expect(searchSubjectTemplate.subject).toEqual(searchTemplate.subject);
  });

  it('should return 409 if a template is created with a duplicate title', async () => {
    stubAuthUserResponse({ abilities: [ABILITIES.TEMPLATE_CREATE] });

    const template = {
      ...newTemplate,
      title: chance.word(),
    };

    const response = await app.inject({
      method: 'POST',
      url: '/templates',
      headers: headersWithToken,
      payload: template,
    });

    expect(response.statusCode).toEqual(201);

    const duplicateResponse = await app.inject({
      method: 'POST',
      url: '/templates',
      headers: headersWithToken,
      payload: template,
    });

    expect(duplicateResponse.statusCode).toEqual(409);
  });

  it('should only show templates from the users companyId', async () => {
    stubAuthUserResponse({
      abilities: [ABILITIES.TEMPLATE_CREATE, ABILITIES.TEMPLATE_VIEW],
    });

    const template = {
      ...newTemplate,
      title: chance.word(),
    };

    const companyId2 = `${companyId}2`;

    const company2Headers = {
      'x-token-payload': buildXTokenPayload({
        companyId: companyId2,
        userId,
        roles,
      }),
    };

    const response = await app.inject({
      method: 'POST',
      url: '/templates',
      headers: company2Headers,
      payload: template,
    });

    expect(response.statusCode).toEqual(201);

    const company2Templates = await app.inject({
      method: 'GET',
      url: '/templates',
      headers: company2Headers,
    });

    expect(company2Templates.statusCode).toEqual(200);
    expect(company2Templates.json().results.length).toEqual(1);
    const [company2Template] = company2Templates.json().results;
    expect(company2Template.companyId).toEqual(companyId2);

    const company1Templates = await app.inject({
      method: 'GET',
      url: '/templates',
      headers: headersWithToken,
    });

    expect(company1Templates.statusCode).toEqual(200);

    const companyIds = company1Templates
      .json()
      .results.map((template) => template.companyId)
      .filter((id) => id === companyId);
    expect(companyIds.length).toEqual(company1Templates.json().results.length);
  });

  it('should be able to paginate results', async () => {
    stubAuthUserResponse({
      abilities: [ABILITIES.TEMPLATE_VIEW, ABILITIES.TEMPLATE_CREATE],
    });

    const NEW_TEMPLATES_COUNT = 10;

    // Lets create a few more templates
    await Promise.all(
      Array(NEW_TEMPLATES_COUNT)
        .fill(0)
        .map(() =>
          app.inject({
            method: 'POST',
            url: '/templates',
            headers: headersWithToken,
            payload: {
              ...newTemplate,
              title: chance.word(),
            },
          }),
        ),
    );

    const allTemplates = await app.inject({
      method: 'GET',
      url: '/templates',
      query: { offset: '0', limit: '100' },
      headers: headersWithToken,
    });

    expect(allTemplates.statusCode).toEqual(200);
    const ids = allTemplates.json().results.map((template) => template.id);
    expect(ids.length).toBeGreaterThan(NEW_TEMPLATES_COUNT);

    const limit = Math.round(ids.length / 2);

    const firstPage = await app.inject({
      method: 'GET',
      url: '/templates',
      query: { offset: '0', limit: `${limit}` },
      headers: headersWithToken,
    });

    expect(firstPage.statusCode).toEqual(200);
    expect(firstPage.json().results.length).toEqual(limit);
    expect(firstPage.json().results.map((template) => template.id)).toEqual(
      ids.slice(0, limit),
    );

    const secondPage = await app.inject({
      method: 'GET',
      url: '/templates',
      query: { offset: `${limit}`, limit: `${limit}` },
      headers: headersWithToken,
    });

    expect(secondPage.statusCode).toEqual(200);
    expect(secondPage.json().results.length).toBeLessThanOrEqual(limit);
    expect(secondPage.json().results.map((template) => template.id)).toEqual(
      ids.slice(limit),
    );
  });

  it('should be able to filter by createdBy', async () => {
    stubAuthUserResponse({
      abilities: [ABILITIES.TEMPLATE_CREATE, ABILITIES.TEMPLATE_VIEW],
    });

    const template = {
      ...newTemplate,
      title: chance.word(),
    };

    const userId2 = chance.guid();

    const headers = {
      'x-token-payload': buildXTokenPayload({
        companyId,
        userId: userId2,
        roles,
      }),
    };

    const response = await app.inject({
      method: 'POST',
      url: '/templates',
      headers,
      payload: template,
    });

    expect(response.statusCode).toEqual(201);

    const userId2Templates = await app.inject({
      method: 'GET',
      url: '/templates',
      headers,
      query: { createdBy: userId2 },
    });

    expect(userId2Templates.statusCode).toEqual(200);
    expect(userId2Templates.json().results.length).toEqual(1);

    const templates = await app.inject({
      method: 'GET',
      url: '/templates',
      headers,
      query: { createdBy: userId },
    });

    const userIds = templates
      .json()
      .results.map((template) => template.createdBy)
      .filter((id) => id === userId);

    expect(userIds.length).toEqual(templates.json().results.length);
  });
});
