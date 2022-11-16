import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@cerbero/mod-auth';
import { rootMongooseTestModule } from './utils/mongooseTest';
import { Chance } from 'chance';
import { TemplatesModule } from '../src/templates/templates.module';
import { TemplateSchema } from '../src/templates/schemas/template.schema';
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

const chance = new Chance();

const companyId = 'test-company-id';
const userId = 'test-user-id';
const roles = ['super_admin'];
const ABILITIES = {
  TEMPLATE_CREATE: 'templates/template:create',
  TEMPLATE_VIEW: 'templates/template:view',
  TEMPLATE_DELETE: 'templates/template:remove',
  TEMPLATE_EDIT: 'templates/template:edit',
  CAMPAIGN_CREATE: 'campaigns/campaign:create',
};

const newTemplate = {
  title: chance.sentence(),
  subject: chance.sentence(),
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

  const clearTemplates = async () => {
    const campaigns = app.get(getModelToken('Template', 'campaigns'));
    await campaigns.deleteMany({});
  };

  beforeAll(async () => {
    headersWithToken = {
      'x-token-payload': buildXTokenPayload({ companyId, userId, roles }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TemplatesModule,
        rootMongooseTestModule('campaigns'),
        rootMongooseTestModule('seed'),
        MongooseModule.forFeature(
          [{ name: 'Templates', schema: TemplateSchema }],
          'campaigns',
        ),
        AuthModule.forRoot(),
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

    setupGlobals(app);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    await clearTemplates();
  });

  afterAll(async () => {
    await clearTemplates();
    await app.close();
    authSandbox.restore();
    userSandbox.restore();
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
      'companyId',
      'createdBy',
      'createdAt',
      'updatedBy',
      'updatedAt',
    ]);
  });

  it('should be able to filter on exact title', async () => {
    const TITLE_SEARCH_STRING = chance.word();

    const searchTemplate = {
      ...newTemplate,
      title: TITLE_SEARCH_STRING,
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
      query: { title: TITLE_SEARCH_STRING },
      headers: headersWithToken,
    });

    const [searchTitleTemplate] = searchTitle.json().results;
    expect(searchTitle.statusCode).toEqual(200);
    expect(searchTitle.json().results.length).toEqual(1);
    expect(searchTitleTemplate.id).toEqual(searchTemplateId);
    expect(searchTitleTemplate.title).toEqual(searchTemplate.title);
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

  it('should show correct count when filtering', async () => {
    const resultCount = await app.inject({
      method: 'GET',
      url: '/templates',
      headers: headersWithToken,
    });

    const count = resultCount.json().count;

    const TITLE_SEARCH_STRING = chance.word();

    const searchTemplate = {
      ...newTemplate,
      title: TITLE_SEARCH_STRING,
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

    const resultCount2 = await app.inject({
      method: 'GET',
      url: '/templates',
      headers: headersWithToken,
    });

    const count2 = resultCount2.json().count;
    expect(count2).toEqual(count + 1);

    const searchTitle = await app.inject({
      method: 'GET',
      url: '/templates',
      query: { title: TITLE_SEARCH_STRING },
      headers: headersWithToken,
    });

    const response = searchTitle.json();
    expect(response.count).toEqual(1);

    const [searchTitleTemplate] = response.results;
    expect(searchTitle.statusCode).toEqual(200);
    expect(searchTitle.json().results.length).toEqual(1);
    expect(searchTitleTemplate.id).toEqual(searchTemplateId);
    expect(searchTitleTemplate.title).toEqual(searchTemplate.title);
  });

  it('should return 409 if a template is created with a duplicate title', async () => {
    stubAuthUserResponse({ abilities: [ABILITIES.TEMPLATE_CREATE] });

    const templateOne = {
      ...newTemplate,
      title: 'Hello',
    };

    const templateTwo = {
      ...newTemplate,
      title: 'hello',
    };

    const response = await app.inject({
      method: 'POST',
      url: '/templates',
      headers: headersWithToken,
      payload: templateOne,
    });

    expect(response.statusCode).toEqual(201);

    const duplicateResponse = await app.inject({
      method: 'POST',
      url: '/templates',
      headers: headersWithToken,
      payload: templateTwo,
    });

    expect(duplicateResponse.statusCode).toEqual(409);
  });

  it('should allow duplicate titles with different companyIds', async () => {
    stubAuthUserResponse({ abilities: [ABILITIES.TEMPLATE_CREATE] });

    const companyId1 = chance.guid();

    const company1Headers = {
      'x-token-payload': buildXTokenPayload({
        companyId: companyId1,
        userId,
        roles,
      }),
    };

    const companyId2 = chance.guid();

    const company2Headers = {
      'x-token-payload': buildXTokenPayload({
        companyId: companyId2,
        userId,
        roles,
      }),
    };

    const template = {
      ...newTemplate,
      title: chance.word(),
    };

    const response = await app.inject({
      method: 'POST',
      url: '/templates',
      headers: company1Headers,
      payload: template,
    });

    expect(response.statusCode).toEqual(201);

    const duplicateResponse = await app.inject({
      method: 'POST',
      url: '/templates',
      headers: company2Headers,
      payload: template,
    });

    expect(duplicateResponse.statusCode).toEqual(201);
  });

  it('should only show templates from the users companyId', async () => {
    stubAuthUserResponse({
      abilities: [ABILITIES.TEMPLATE_CREATE, ABILITIES.TEMPLATE_VIEW],
    });

    const template = {
      ...newTemplate,
      title: chance.word(),
    };

    const companyId2 = chance.guid();

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

  it('should be able to sort by createdAt', async () => {
    const templatesAsc = await app.inject({
      method: 'GET',
      url: '/templates',
      headers: headersWithToken,
      query: { sortBy: 'createdAt', sortOrder: 'asc' },
    });

    expect(templatesAsc.statusCode).toEqual(200);
    const asc = templatesAsc.json().results;

    const templatesDesc = await app.inject({
      method: 'GET',
      url: '/templates',
      headers: headersWithToken,
      query: { sortBy: 'createdAt', sortOrder: 'desc' },
    });

    expect(templatesDesc.statusCode).toEqual(200);
    const desc = templatesDesc.json().results;

    expect(asc.reverse()).toEqual(desc);
  });

  it('should be able to fetch a single template', async () => {
    stubAuthUserResponse({
      abilities: [ABILITIES.TEMPLATE_CREATE, ABILITIES.TEMPLATE_VIEW],
    });

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

    const createdTemplate = response.json();

    const getTemplate = await app.inject({
      method: 'GET',
      url: `/templates/${createdTemplate.id}`,
      headers: headersWithToken,
    });

    expect(getTemplate.statusCode).toEqual(200);
    expect(getTemplate.json()).toEqual(createdTemplate);
  });

  it('should return 404 for non-existent template', async () => {
    stubAuthUserResponse({ abilities: [ABILITIES.TEMPLATE_VIEW] });

    const template = await app.inject({
      method: 'GET',
      url: `/templates/${chance.guid()}`,
      headers: headersWithToken,
    });

    expect(template.statusCode).toEqual(404);
    expect(template.json()).toEqual({ statusCode: 404, message: 'Not Found' });
  });

  it('should be able to delete a template', async () => {
    stubAuthUserResponse({
      abilities: [ABILITIES.TEMPLATE_CREATE, ABILITIES.TEMPLATE_DELETE],
    });

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

    const responseTemplateId = JSON.parse(response.body).id;

    const deletedTemplate = await app.inject({
      method: 'DELETE',
      url: `/templates/${responseTemplateId}`,
      headers: headersWithToken,
    });

    expect(deletedTemplate.statusCode).toEqual(204);
  });

  it('should return 404 when deleting a non-existent template', async () => {
    stubAuthUserResponse({ abilities: [ABILITIES.TEMPLATE_DELETE] });

    const template = await app.inject({
      method: 'DELETE',
      url: `/templates/${chance.guid()}`,
      headers: headersWithToken,
    });

    expect(template.statusCode).toEqual(404);
    expect(template.json()).toEqual({ statusCode: 404, message: 'Not Found' });
  });

  it('should be able to update a template', async () => {
    stubAuthUserResponse({
      abilities: [
        ABILITIES.TEMPLATE_CREATE,
        ABILITIES.TEMPLATE_VIEW,
        ABILITIES.TEMPLATE_EDIT,
      ],
    });

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

    const createdTemplate = response.json();

    const updatedPayload = {
      title: chance.word(),
      subject: chance.word(),
      unlayer: {
        json: { foo: chance.word() },
        previewUrl: chance.url(),
      },
    };

    const updateResponse = await app.inject({
      method: 'PUT',
      url: `/templates/${createdTemplate.id}`,
      headers: headersWithToken,
      payload: updatedPayload,
    });

    expect(updateResponse.statusCode).toEqual(200);
    expect(updateResponse.json().title).toEqual(updatedPayload.title);

    const getTemplate = await app.inject({
      method: 'GET',
      url: `/templates/${createdTemplate.id}`,
      headers: headersWithToken,
    });

    expect(getTemplate.statusCode).toEqual(200);
    expect(getTemplate.json()).toEqual(expect.objectContaining(updatedPayload));
  });

  it('should return 409 if updated with a duplicate title', async () => {
    stubAuthUserResponse({
      abilities: [
        ABILITIES.TEMPLATE_CREATE,
        ABILITIES.TEMPLATE_VIEW,
        ABILITIES.TEMPLATE_EDIT,
      ],
    });

    const templateOne = {
      ...newTemplate,
      title: chance.word(),
    };

    const templateTwo = {
      ...newTemplate,
      title: 'Template',
    };

    const responseOne = await app.inject({
      method: 'POST',
      url: '/templates',
      headers: headersWithToken,
      payload: templateOne,
    });

    const createdTemplateOne = responseOne.json();
    expect(responseOne.statusCode).toEqual(201);

    const responseTwo = await app.inject({
      method: 'POST',
      url: '/templates',
      headers: headersWithToken,
      payload: templateTwo,
    });

    expect(responseTwo.statusCode).toEqual(201);

    const updatedPayload = {
      ...newTemplate,
      title: 'template',
    };

    const updateResponse = await app.inject({
      method: 'PUT',
      url: `/templates/${createdTemplateOne.id}`,
      headers: headersWithToken,
      payload: updatedPayload,
    });

    expect(updateResponse.statusCode).toEqual(409);
    expect(updateResponse.json().message).toEqual(
      'The following properties must be unique: title',
    );
    expect(updateResponse.json().error).toEqual('Conflict');
  });

  it('should return 404 if you updated a non-existent template', async () => {
    stubAuthUserResponse({
      abilities: [
        ABILITIES.TEMPLATE_CREATE,
        ABILITIES.TEMPLATE_VIEW,
        ABILITIES.TEMPLATE_EDIT,
      ],
    });

    const updatedPayload = {
      title: chance.word(),
      subject: chance.word(),
      unlayer: {
        json: { foo: chance.word() },
        previewUrl: chance.url(),
      },
    };

    const updateResponse = await app.inject({
      method: 'PUT',
      url: `/templates/${chance.guid()}`,
      headers: headersWithToken,
      payload: updatedPayload,
    });

    expect(updateResponse.statusCode).toEqual(404);
  });

  it('should be able to create a template without a previewUrl', async () => {
    stubAuthUserResponse({ abilities: [ABILITIES.TEMPLATE_CREATE] });

    const template = {
      ...newTemplate,
      title: chance.word(),
      unlayer: {
        json: newTemplate.unlayer.json,
      },
    };

    const response = await app.inject({
      method: 'POST',
      url: '/templates',
      headers: headersWithToken,
      payload: template,
    });

    expect(response.statusCode).toEqual(201);
    expect(response.json().unlayer.previewUrl).toEqual(null);
  });

  it('should be able to update a template without a previewUrl', async () => {
    stubAuthUserResponse({
      abilities: [ABILITIES.TEMPLATE_CREATE, ABILITIES.TEMPLATE_EDIT],
    });

    const template = {
      ...newTemplate,
      title: chance.word(),
    };

    const responseOne = await app.inject({
      method: 'POST',
      url: '/templates',
      headers: headersWithToken,
      payload: template,
    });

    expect(responseOne.statusCode).toEqual(201);
    const { id } = responseOne.json();

    const updatedTemplate = {
      ...template,
      unlayer: {
        json: newTemplate.unlayer.json,
      },
    };

    const responseTwo = await app.inject({
      method: 'PUT',
      url: `/templates/${id}`,
      headers: headersWithToken,
      payload: updatedTemplate,
    });

    expect(responseTwo.statusCode).toEqual(200);
    expect(responseTwo.json().unlayer.previewUrl).toEqual(null);
  });

  it('should be able to get a unique list of createdBy users', async () => {
    stubAuthUserResponse({
      abilities: [ABILITIES.TEMPLATE_VIEW],
    });

    const firstName = chance.first();
    const lastName = chance.last();

    stubUserResponse({
      id: 'test',
      firstName,
      lastName,
    });

    const templateResponse = await app.inject({
      method: 'GET',
      url: '/templates',
      headers: headersWithToken,
      query: { offset: '0', limit: '100' },
    });

    const templates = templateResponse.json();

    const uniqueUserIds = [
      ...new Set(templates.results.map((t) => t.createdBy)),
    ];

    const result = await app.inject({
      method: 'GET',
      url: '/templates/users',
      headers: headersWithToken,
    });

    const users = result.json();
    const names = users.map((u) => u.user.name);
    names.forEach((n) => expect(n).toEqual(`${firstName} ${lastName}`));

    const ids = users.map((u) => u.id);
    expect(uniqueUserIds.sort()).toEqual(ids.sort());
  });

  it('should be able to search for a template using the title, insensitively', async () => {
    stubAuthUserResponse({
      abilities: [ABILITIES.TEMPLATE_CREATE, ABILITIES.TEMPLATE_VIEW],
    });

    const template = {
      ...newTemplate,
      title: 'Title',
    };

    const postResponse = await app.inject({
      method: 'POST',
      url: '/templates',
      headers: headersWithToken,
      payload: template,
    });

    expect(postResponse.statusCode).toEqual(201);

    const getResponseOne = await app.inject({
      method: 'GET',
      url: `/templates`,
      headers: headersWithToken,
      query: { title: template.title },
    });

    expect(getResponseOne.statusCode).toEqual(200);
    expect(getResponseOne.json().results.length).toBe(1);

    const getResponseTwo = await app.inject({
      method: 'GET',
      url: `/templates`,
      headers: headersWithToken,
      query: { title: template.title.toUpperCase() },
    });

    expect(getResponseTwo.statusCode).toEqual(200);
    expect(getResponseTwo.json().results.length).toBe(1);

    const getResponseThree = await app.inject({
      method: 'GET',
      url: `/templates`,
      headers: headersWithToken,
      query: { title: template.title.concat(' 123') },
    });

    expect(getResponseThree.statusCode).toEqual(200);
    expect(getResponseThree.json().results.length).toBe(0);
  });

  it('should be able to search for a template with a title containing special characters', async () => {
    stubAuthUserResponse({
      abilities: [ABILITIES.TEMPLATE_CREATE, ABILITIES.TEMPLATE_VIEW],
    });

    const template = {
      ...newTemplate,
      title: 'Title*?&',
    };

    const postResponse = await app.inject({
      method: 'POST',
      url: '/templates',
      headers: headersWithToken,
      payload: template,
    });

    expect(postResponse.statusCode).toEqual(201);

    const getResponseOne = await app.inject({
      method: 'GET',
      url: `/templates`,
      headers: headersWithToken,
      query: { title: template.title },
    });

    expect(getResponseOne.statusCode).toEqual(200);
    expect(getResponseOne.json().results.length).toBe(1);

    const getResponseTwo = await app.inject({
      method: 'GET',
      url: `/templates`,
      headers: headersWithToken,
      query: { title: template.title.toUpperCase() },
    });

    expect(getResponseTwo.statusCode).toEqual(200);
    expect(getResponseTwo.json().results.length).toBe(1);

    const getResponseThree = await app.inject({
      method: 'GET',
      url: `/templates`,
      headers: headersWithToken,
      query: { title: template.title.concat(' 123') },
    });

    expect(getResponseThree.statusCode).toEqual(200);
    expect(getResponseThree.json().results.length).toBe(0);
  });
});
