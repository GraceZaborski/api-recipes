import { getMongoConfig } from './mongoConfigFromDal';

const {
  PORT = 8000,
  BIND_ADDRESS = '0.0.0.0',
  NAMESPACE,
  LOG_LEVEL = 'info',
  MONGO_URI = 'mongodb://localhost/campaigns',
  MONGO_URI_SEED = 'mongodb://localhost/seed',
  SVC_NAME = 'api-campaigns',
  ENABLE_SWAGGER = 'true',
  UNLAYER_ONPREM_API_KEY,
  DOMAIN = 'aether.staging.beamery.engineer',
  LOCAL_DOMAIN,
  CAMPAIGN_V2_PUBLIC_BUCKET = 'name',
  CAMPAIGN_V2_PUBLIC_HOSTNAME,
  GCP_API_ENDPOINT = undefined,
  GCP_PROJECT_ID = undefined,
} = process.env;

export const isLocal = !NAMESPACE;

const mongoCampaigns = getMongoConfig('CAMPAIGNS', {
  appName: SVC_NAME,
});

const mongoSeed = getMongoConfig('CAMPAIGNS_SEED', {
  appName: SVC_NAME,
});

if (!isLocal && !mongoCampaigns) {
  throw new Error('No mongo config for campaigns');
}

if (!isLocal && !mongoSeed) {
  throw new Error('No mongo config for seed');
}

export const config = {
  serviceName: SVC_NAME,
  externalUrl: isLocal
    ? LOCAL_DOMAIN
    : `https://frontier.${DOMAIN}/api-campaigns`,
  port: PORT,
  bindAddress: BIND_ADDRESS,
  isLocal,
  logLevel: LOG_LEVEL,
  enableSwagger: ENABLE_SWAGGER === 'true',
  telemetry: {
    endpoint: '/metrics',
    port: 8001,
  },
  mongo: {
    uri: isLocal ? MONGO_URI : mongoCampaigns.uri,
    ...(isLocal ? {} : mongoCampaigns.options),
  },
  mongoSeed: {
    uri: isLocal ? MONGO_URI_SEED : mongoSeed.uri,
    ...(isLocal ? {} : mongoSeed.options),
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
  uploads: {
    image: {
      resizeTo: 800,
    },
  },
  gcp: {
    storage: {
      bucket: CAMPAIGN_V2_PUBLIC_BUCKET,
      hostname: CAMPAIGN_V2_PUBLIC_HOSTNAME,
      protocol: 'https',
      apiEndpoint: GCP_API_ENDPOINT,
      projectId: GCP_PROJECT_ID,
    },
  },
};

export default () => {
  return config;
};
