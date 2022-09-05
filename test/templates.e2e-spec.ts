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
import { ConfigModule } from '@nestjs/config';
import configuration from '../src/config/configuration';

import { proto } from '@beamery/chimera-auth-client';
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
};

const design = {
  counters: { u_row: 1, u_column: 1, u_content_text: 1, u_content_image: 1 },
  body: {
    id: 'cXXcF1U4S8',
    rows: [
      {
        id: 'qtnc_BST9x',
        cells: [1],
        columns: [
          {
            id: '_vyAvcBBmd',
            contents: [
              {
                id: 'YQEc_9ZPYF',
                type: 'text',
                values: {
                  containerPadding: '10px',
                  anchor: '',
                  textAlign: 'left',
                  lineHeight: '140%',
                  linkStyle: {
                    inherit: true,
                    linkColor: '#0000ee',
                    linkHoverColor: '#0000ee',
                    linkUnderline: true,
                    linkHoverUnderline: true,
                  },
                  hideDesktop: false,
                  displayCondition: null,
                  _meta: {
                    htmlID: 'u_content_text_1',
                    htmlClassNames: 'u_content_text',
                  },
                  selectable: true,
                  draggable: true,
                  duplicatable: true,
                  deletable: true,
                  hideable: true,
                  text: '<p style="font-size: 14px; line-height: 140%;">This is a new Text block. Change the text.<br />This is a new Text block. Change the text. 1</p>\n<p style="font-size: 14px; line-height: 140%;">This is a new Text block. Change the text. 2</p>\n<p style="font-size: 14px; line-height: 140%;">This is a new Text block. Change the text.3 </p>\n<p style="font-size: 14px; line-height: 140%;">This is a new Text block. Change the text.4</p>\n<p style="font-size: 14px; line-height: 140%;">This is a new Text block. Change the text.5</p>\n<p style="font-size: 14px; line-height: 140%;">This is a new Text block. Change the text.6</p>\n<p style="font-size: 14px; line-height: 140%;">This is a new Text block. Change the text.7</p>\n<p style="font-size: 14px; line-height: 140%;">This is a new Text block. Change the text.8</p>\n<p style="font-size: 14px; line-height: 140%;">\\This is a new Text block. Change the text.9</p>\n<p style="font-size: 14px; line-height: 140%;">This is a new Text block. Change the text.10</p>',
                },
              },
            ],
            values: {
              backgroundColor: '',
              padding: '0px',
              borderRadius: '0px',
              _meta: { htmlID: 'u_column_1', htmlClassNames: 'u_column' },
            },
          },
        ],
        values: {
          displayCondition: null,
          columns: false,
          backgroundColor: '',
          columnsBackgroundColor: '',
          backgroundImage: {
            url: '',
            fullWidth: true,
            repeat: false,
            center: true,
            cover: false,
          },
          padding: '0px',
          anchor: '',
          hideDesktop: false,
          _meta: { htmlID: 'u_row_1', htmlClassNames: 'u_row' },
          selectable: true,
          draggable: true,
          duplicatable: true,
          deletable: true,
          hideable: true,
        },
      },
    ],
    values: {
      popupPosition: 'center',
      popupWidth: '600px',
      popupHeight: 'auto',
      borderRadius: '10px',
      contentAlign: 'center',
      contentVerticalAlign: 'center',
      contentWidth: '500px',
      fontFamily: { label: 'Arial', value: 'arial,helvetica,sans-serif' },
      textColor: '#000000',
      popupBackgroundColor: '#FFFFFF',
      popupBackgroundImage: {
        url: '',
        fullWidth: true,
        repeat: false,
        center: true,
        cover: true,
      },
      popupOverlay_backgroundColor: 'rgba(0, 0, 0, 0.1)',
      popupCloseButton_position: 'top-right',
      popupCloseButton_backgroundColor: '#DDDDDD',
      popupCloseButton_iconColor: '#000000',
      popupCloseButton_borderRadius: '0px',
      popupCloseButton_margin: '0px',
      popupCloseButton_action: {
        name: 'close_popup',
        attrs: {
          onClick:
            "document.querySelector('.u-popup-container').style.display = 'none';",
        },
      },
      backgroundColor: '#ffffff',
      backgroundImage: {
        url: '',
        fullWidth: true,
        repeat: false,
        center: true,
        cover: false,
      },
      preheaderText: '',
      linkStyle: {
        body: true,
        linkColor: '#0000ee',
        linkHoverColor: '#0000ee',
        linkUnderline: true,
        linkHoverUnderline: true,
      },
      _meta: { htmlID: 'u_body', htmlClassNames: 'u_body' },
    },
  },
  schemaVersion: 9,
};

const generateTemplate = () => ({
  title: chance.sentence(),
  subject: chance.sentence(),
  unlayer: {
    json: design,
  },
});

const newTemplate = generateTemplate();

const allTemplatesResponse = {
  results: [],
  count: 0,
  limit: 20,
  offset: 0,
};

jest.setTimeout(60000);

// pesky secrets detection
const ul = ['Y8fjb', 'OVsy5XU'].join();

describe('TemplatesController (e2e)', () => {
  let app: NestFastifyApplication;
  let headersWithToken;

  const gcpApiEndpoint = 'http://localhost:4443';

  beforeAll(async () => {
    const config = configuration();
    config.gcp.storage.apiEndpoint = gcpApiEndpoint;
    config.gcp.storage.bucket = 'dummy_bucket';
    config.gcp.storage.hostname = 'localhost:4443';
    config.gcp.storage.protocol = 'http';

    config.unlayer = {
      apiKey: ul,
      apiUrl: `https://frontier.aether.staging.beamery.engineer/unlayer-export-api/v1`,
      previewImage: {
        displayMode: 'email',
        width: 422,
        height: 355,
      },
    };

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
        ConfigModule.forRoot({
          load: [() => config],
          isGlobal: true,
        }),
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
    jest.setTimeout(10000);
    console.log('closing mongo');
    await closeInMongodConnection();
    console.log('closing app');
    // setTimeout(() => {
    //   console.log(process._getActiveHandles());
    // }, 4000);
    await app.close();
    console.log('closing restore');
    sandbox.restore();
    console.log('closed');
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
    expect(getTemplate.json()).toEqual(
      expect.objectContaining({
        ...updatedPayload,
        unlayer: {
          ...updatedPayload.unlayer,
          previewUrl: null,
        },
      }),
    );
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
      title: chance.word(),
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
      title: templateTwo.title,
      ...newTemplate,
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

  it('should be able to create a template with a preview sync', async () => {
    stubAuthUserResponse({ abilities: [ABILITIES.TEMPLATE_CREATE] });

    const template = generateTemplate();

    const response = await app.inject({
      method: 'POST',
      url: '/templates',
      headers: headersWithToken,
      payload: {
        ...template,
        generatePreview: 'sync',
      },
    });

    expect(response.statusCode).toEqual(201);
    const { previewUrl } = response.json().unlayer;
    expect(previewUrl).toBeDefined();
    expect(
      previewUrl.startsWith(`http://localhost:4443/${companyId}/export-image/`),
    ).toBeTruthy();
    expect(previewUrl.endsWith('.png')).toBeTruthy();
  });
});
