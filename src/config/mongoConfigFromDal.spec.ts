import { getMongoConfig } from './mongoConfigFromDal';

describe('MongoConfigFromDal', () => {
  afterEach(() => {
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith('DAL_MONGODB_TEST')) {
        delete process.env[key];
      }
    });
  });

  it('should return null if database is not defined', () => {
    expect(getMongoConfig('THISCOULDNTPOSSIBLYEXIST😎')).toBeNull();
  });

  it('should return a config for a valid DAL config', () => {
    process.env = {
      ...process.env,
      DAL_MONGODB_TEST_database: 'test',
      DAL_MONGODB_TEST_nodes: 'localhost:27017',
      DAL_MONGODB_TEST_username: 'test',
      DAL_MONGODB_TEST_password: 'test',
      DAL_MONGODB_TEST_enableTls: 'true',
      DAL_MONGODB_TEST_pemPath: 'test',
      DAL_MONGODB_TEST_readPreference: 'primary',
      DAL_MONGODB_TEST_replicaSet: 'test',
    };

    expect(getMongoConfig('TEST')).toMatchInlineSnapshot(`
      Object {
        "options": Object {
          "authMechanism": "SCRAM-SHA-1",
          "authSource": "admin",
          "dbName": "test",
          "readPreference": "primary",
          "replicaSet": "test",
          "tls": true,
          "tlsCertificateFile": "test",
          "tlsInsecure": true,
        },
        "uri": "mongodb://test:test@localhost:27017/test",
      }
    `);
  });

  it('should return a config for a valid DAL config with options', () => {
    process.env = {
      ...process.env,
      DAL_MONGODB_TEST_database: 'test',
      DAL_MONGODB_TEST_nodes: 'localhost:27017',
      DAL_MONGODB_TEST_username: 'test',
      DAL_MONGODB_TEST_password: 'test',
      DAL_MONGODB_TEST_enableTls: 'true',
      DAL_MONGODB_TEST_pemPath: 'test',
      DAL_MONGODB_TEST_readPreference: 'primary',
      DAL_MONGODB_TEST_replicaSet: 'test',
    };

    expect(getMongoConfig('TEST', { foo: 'bar' })).toMatchInlineSnapshot(`
      Object {
        "options": Object {
          "authMechanism": "SCRAM-SHA-1",
          "authSource": "admin",
          "dbName": "test",
          "foo": "bar",
          "readPreference": "primary",
          "replicaSet": "test",
          "tls": true,
          "tlsCertificateFile": "test",
          "tlsInsecure": true,
        },
        "uri": "mongodb://test:test@localhost:27017/test",
      }
    `);
  });

  it('should set tls to false if enableTls not set', () => {
    process.env = {
      ...process.env,
      DAL_MONGODB_TEST_database: 'test',
      DAL_MONGODB_TEST_nodes: 'localhost:27017',
      DAL_MONGODB_TEST_username: 'test',
      DAL_MONGODB_TEST_password: 'test',
      DAL_MONGODB_TEST_pemPath: 'test',
      DAL_MONGODB_TEST_readPreference: 'primary',
      DAL_MONGODB_TEST_replicaSet: 'test',
    };

    expect(getMongoConfig('TEST').options.tls).toEqual(false);
  });

  it('should set tls to false if enableTls=false', () => {
    process.env = {
      ...process.env,
      DAL_MONGODB_TEST_database: 'test',
      DAL_MONGODB_TEST_nodes: 'localhost:27017',
      DAL_MONGODB_TEST_username: 'test',
      DAL_MONGODB_TEST_password: 'test',
      DAL_MONGODB_TEST_pemPath: 'test',
      DAL_MONGODB_TEST_readPreference: 'primary',
      DAL_MONGODB_TEST_replicaSet: 'test',
      DAL_MONGODB_TEST_enableTls: 'false',
    };

    expect(getMongoConfig('TEST').options.tls).toEqual(false);
  });

  it('should add username and password to uri if set', () => {
    process.env = {
      ...process.env,
      DAL_MONGODB_TEST_database: 'test',
      DAL_MONGODB_TEST_nodes: 'localhost:27017',
      DAL_MONGODB_TEST_username: 'user',
      DAL_MONGODB_TEST_password: 'pass',
      DAL_MONGODB_TEST_pemPath: 'test',
      DAL_MONGODB_TEST_readPreference: 'primary',
      DAL_MONGODB_TEST_replicaSet: 'test',
      DAL_MONGODB_TEST_enableTls: 'false',
    };

    expect(
      getMongoConfig('TEST').uri.startsWith(
        `mongodb://${process.env.DAL_MONGODB_TEST_username}:${process.env.DAL_MONGODB_TEST_password}@`,
      ),
    ).toEqual(true);
  });

  it('should omit username and password from uri if not set', () => {
    process.env = {
      ...process.env,
      DAL_MONGODB_TEST_database: 'test',
      DAL_MONGODB_TEST_nodes: 'localhost:27017',
      DAL_MONGODB_TEST_pemPath: 'test',
      DAL_MONGODB_TEST_readPreference: 'primary',
      DAL_MONGODB_TEST_replicaSet: 'test',
      DAL_MONGODB_TEST_enableTls: 'false',
    };

    expect(
      getMongoConfig('TEST').uri.startsWith(
        `mongodb://${process.env.DAL_MONGODB_TEST_nodes}`,
      ),
    ).toEqual(true);
  });
});
