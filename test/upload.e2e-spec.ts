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
  authStub,
} from './utils/authUtils';

import { proto } from '@beamery/chimera-auth-client';
import { setupGlobals } from '../src/globals';
import { join } from 'path';
import { createReadStream } from 'fs';
import { UploadModule } from '../src/upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '../src/logger';
import configuration from '../src/config/configuration';
import * as FormData from 'form-data';
import sizeOf from 'image-size';

const companyId = 'test-company-id';
const userId = 'test-user-id';
const roles = ['super_admin'];
const ABILITIES = {
  TEMPLATE_CREATE: 'templates/template:create',
  TEMPLATE_VIEW: 'templates/template:view',
  TEMPLATE_DELETE: 'templates/template:remove',
  TEMPLATE_EDIT: 'templates/template:edit',
};

const gcpApiEndpoint = 'http://localhost:4443';

describe('UploadController (e2e)', () => {
  let app: NestFastifyApplication;
  let headersWithToken;

  beforeAll(async () => {
    const config = configuration();
    config.gcp.storage.apiEndpoint = gcpApiEndpoint;
    config.gcp.storage.bucket = 'dummy_bucket';
    config.gcp.storage.hostname = 'localhost:4443';
    config.gcp.storage.protocol = 'http';

    headersWithToken = {
      'x-token-payload': buildXTokenPayload({ companyId, userId, roles }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule,
        ConfigModule.forRoot({
          load: [() => config],
          isGlobal: true,
        }),
        UploadModule,
        AuthModule.forRoot(),
      ],
    })
      .overrideProvider(proto.Auth)
      .useValue(authStub)
      .compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    setupGlobals(app, { useLogger: false });

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
    authSandbox.restore();
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

    const objectPath = url.replace('http://localhost:4443/', '');

    const objectUrl = `${gcpApiEndpoint}/storage/v1/b/dummy_bucket/o/${objectPath}`;
    const req = await fetch(objectUrl);
    const object = await req.json();
    expect(object.contentType).toEqual('image/png');

    const imageReq = await fetch(`${objectUrl}?alt=media`);
    const image = Buffer.from(await imageReq.arrayBuffer());
    const { width } = sizeOf(image);

    expect(width).toEqual(configuration().uploads.image.resizeTo);
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
