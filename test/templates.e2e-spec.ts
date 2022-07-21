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
    expect(response.json()).toEqual([]);
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
    expect(response.json()[0]).toEqual(
      expect.objectContaining({
        ...newTemplate,
        companyId,
        createdBy: userId,
      }),
    );
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

    const [searchTitleTemplate] = searchTitle.json();
    expect(searchTitle.statusCode).toEqual(200);
    expect(searchTitle.json().length).toEqual(1);
    expect(searchTitleTemplate.id).toEqual(searchTemplateId);
    expect(searchTitleTemplate.title).toEqual(searchTemplate.title);

    const searchSubject = await app.inject({
      method: 'GET',
      url: '/templates',
      query: { search: SUBJECT_SEARCH_STRING },
      headers: headersWithToken,
    });

    const [searchSubjectTemplate] = searchSubject.json();
    expect(searchSubject.statusCode).toEqual(200);
    expect(searchSubject.json().length).toEqual(1);
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
});
