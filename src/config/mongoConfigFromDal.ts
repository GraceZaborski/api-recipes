import { MongooseModuleOptions } from '@nestjs/mongoose';
import { ReadPreferenceMode } from 'mongodb';

export const getMongoConfig = (configName, opts = {}) => {
  const dbName = process.env[`DAL_MONGODB_${configName}_database`];
  if (!dbName) {
    return null;
  }

  const options: MongooseModuleOptions = {
    readPreference: process.env[
      `DAL_MONGODB_${configName}_readPreference`
    ] as ReadPreferenceMode,
    replicaSet: process.env[`DAL_MONGODB_${configName}_replicaSet`],
    tlsCertificateFile: process.env[`DAL_MONGODB_${configName}_pemPath`],
    tls: process.env[`DAL_MONGODB_${configName}_enableTls`] === 'true',
    dbName,
    authSource: 'admin',
    authMechanism: 'SCRAM-SHA-1',
    tlsInsecure: true,
    ...opts,
  };

  const username = process.env[`DAL_MONGODB_${configName}_username`];
  const password = process.env[`DAL_MONGODB_${configName}_password`];
  const nodes = process.env[`DAL_MONGODB_${configName}_nodes`];

  const mongoAuth = username && password ? `${username}:${password}@` : '';

  const uri = `mongodb://${mongoAuth}${nodes}/${options.dbName}`;

  return {
    uri,
    options,
  };
};
