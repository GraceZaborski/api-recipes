import { MongooseModuleOptions } from '@nestjs/mongoose';
import { ReadPreferenceMode } from 'mongodb';

export const getMongoConfig = (configName, appName) => {
  const dbName = process.env[`DAL_MONGODB_${configName}_database`];
  if (!dbName) {
    return null;
  }

  const options: MongooseModuleOptions = {
    appName,
    replicaSet: process.env[`DAL_MONGODB_${configName}_replicaSet`],
    dbName,
    enableTls: process.env[`DAL_MONGODB_${configName}_enableTls`],
    tls: process.env[`DAL_MONGODB_${configName}_pemPath`] === 'true',
    readPreference: process.env[
      `DAL_MONGODB_${configName}_readPreference`
    ] as ReadPreferenceMode,
    authSource: 'admin',
    authMechanism: 'SCRAM-SHA-1',
    tlsInsecure: true,
  };

  const username = process.env[`DAL_MONGODB_${configName}_username`];
  const password = process.env[`DAL_MONGODB_${configName}_passsword`];
  const nodes = process.env[`DAL_MONGODB_${configName}_nodes`];

  const mongoAuth = username && password ? `${username}:${password}@` : '';

  const uri = `mongodb://${mongoAuth}${username}${nodes}/${options.dbName}`;

  return {
    uri,
    options,
  };
};
