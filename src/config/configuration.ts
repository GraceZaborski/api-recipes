import { ReadPreferenceMode } from 'mongodb';
import { MongooseModuleOptions } from '@nestjs/mongoose';

const {
  PORT = 8000,
  BIND_ADDRESS = '0.0.0.0',
  NAMESPACE,
  LOG_LEVEL = 'info',
  MONGO_URI = 'mongodb://localhost/campaigns',
  DAL_MONGODB_CAMPAIGNS_replicaSet,
  DAL_MONGODB_CAMPAIGNS_username,
  DAL_MONGODB_CAMPAIGNS_password,
  DAL_MONGODB_CAMPAIGNS_database,
  DAL_MONGODB_CAMPAIGNS_enableTls,
  DAL_MONGODB_CAMPAIGNS_pemPath,
  DAL_MONGODB_CAMPAIGNS_nodes,
  DAL_MONGODB_CAMPAIGNS_readPreference,
  SVC_NAME = 'api-campaigns',
  ENABLE_SWAGGER = 'true',
  UNLAYER_ONPREM_API_KEY,
  DOMAIN = 'aether.staging.beamery.engineer',
  CAMPAIGN_V2_PUBLIC_BUCKET = 'name',
  CAMPAIGN_V2_PUBLIC_HOSTNAME,
} = process.env;

export const isLocal = !NAMESPACE;

const mongoOptions: MongooseModuleOptions = {
  appName: SVC_NAME,
  readPreference: DAL_MONGODB_CAMPAIGNS_readPreference as ReadPreferenceMode,
  replicaSet: DAL_MONGODB_CAMPAIGNS_replicaSet,
  tlsCertificateFile: DAL_MONGODB_CAMPAIGNS_pemPath,
  tls: DAL_MONGODB_CAMPAIGNS_enableTls === 'true',
  dbName: DAL_MONGODB_CAMPAIGNS_database,
  authSource: 'admin',
  authMechanism: 'SCRAM-SHA-1',
  tlsInsecure: true,
};

let mongoAuth = '';
if (DAL_MONGODB_CAMPAIGNS_username && DAL_MONGODB_CAMPAIGNS_password) {
  mongoAuth = `${DAL_MONGODB_CAMPAIGNS_username}:${DAL_MONGODB_CAMPAIGNS_password}@`;
}

const dalUrl = `mongodb://${mongoAuth}${DAL_MONGODB_CAMPAIGNS_username}${DAL_MONGODB_CAMPAIGNS_nodes}/${DAL_MONGODB_CAMPAIGNS_database}`;

export const config = {
  port: PORT,
  bindAddress: BIND_ADDRESS,
  isLocal,
  logLevel: LOG_LEVEL,
  enableSwagger: ENABLE_SWAGGER === 'true',
  mongo: {
    uri: isLocal ? MONGO_URI : dalUrl,
    ...(isLocal ? {} : mongoOptions),
    loggerLevel: 'debug',
  },
  unlayer: {
    apiKey: UNLAYER_ONPREM_API_KEY,
    apiUrl: `https://frontier.${DOMAIN}/unlayer-export-api/v1`,
    previewImage: {
      displayMode: 'email',
      width: 422,
      height: 355,
    },
  },
  gcp: {
    storage: {
      bucket: CAMPAIGN_V2_PUBLIC_BUCKET,
      hostname: CAMPAIGN_V2_PUBLIC_HOSTNAME,
    },
  },
};

export default () => config;
