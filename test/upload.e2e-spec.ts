import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AuthModule } from '@cerbero/mod-auth';
import {
  stubAuthUserResponse,
  buildXTokenPayload,
  authSandbox,
  sandbox,
} from './utils/authUtils';

import { proto } from '@beamery/chimera-auth-client';
import { setupGlobals } from '../src/globals';
import { join } from 'path';
import { createReadStream } from 'fs';
import { UploadModule } from '../src/upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../src/config/configuration';
import * as FormData from 'form-data';

const companyId = 'test-company-id';
const userId = 'test-user-id';
const roles = ['super_admin'];
const ABILITIES = {
  TEMPLATE_CREATE: 'templates/template:create',
  TEMPLATE_VIEW: 'templates/template:view',
  TEMPLATE_DELETE: 'templates/template:remove',
  TEMPLATE_EDIT: 'templates/template:edit',
};

// This is skipped by default as it requires gcp credentials to run.
describe.skip('UploadController (e2e)', () => {
  let app: NestFastifyApplication;
  let headersWithToken;

  beforeAll(async () => {
    headersWithToken = {
      'x-token-payload': buildXTokenPayload({ companyId, userId, roles }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
        UploadModule,
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
    await app.close();
    sandbox.restore();
  });

  it('should be able to upload an image', async () => {
    stubAuthUserResponse({
      abilities: [
        ABILITIES.TEMPLATE_CREATE,
        ABILITIES.TEMPLATE_VIEW,
        ABILITIES.TEMPLATE_EDIT,
      ],
    });

    const form = new FormData();
    form.append(
      'image',
      createReadStream(join(__dirname, './assets/example.png')),
    );

    const response = await app.inject({
      method: 'POST',
      url: '/upload/image',
      payload: form,
      headers: {
        ...headersWithToken,
        ...form.getHeaders(),
      },
    });

    expect(response.statusCode).toEqual(201);
    const { url } = response.json();
    expect(url.includes('.jpg')).toBe(true);
  });

  it('should return 400 if its not an image', async () => {
    stubAuthUserResponse({
      abilities: [
        ABILITIES.TEMPLATE_CREATE,
        ABILITIES.TEMPLATE_VIEW,
        ABILITIES.TEMPLATE_EDIT,
      ],
    });

    const form = new FormData();
    form.append('image', createReadStream(join(__dirname, './jest-e2e.json')));

    const response = await app.inject({
      method: 'POST',
      url: '/upload/image',
      payload: form,
      headers: {
        ...headersWithToken,
        ...form.getHeaders(),
      },
    });

    expect(response.statusCode).toEqual(400);
  });

  it('should return 403 with no auth', async () => {
    stubAuthUserResponse({});

    const form = new FormData();
    form.append(
      'image',
      createReadStream(join(__dirname, './assets/example.png')),
    );

    const response = await app.inject({
      method: 'POST',
      url: '/upload/image',
      payload: form,
      headers: {
        ...form.getHeaders(),
      },
    });

    expect(response.statusCode).toEqual(403);
  });
});
