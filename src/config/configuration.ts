const {
  PORT = 8080,
  BIND_ADDRESS = '0.0.0.0',
  NAMESPACE,
  LOG_LEVEL = 'info',
  MONGO_URI = 'mongodb://localhost/campaigns',
} = process.env;

export default () => ({
  port: PORT,
  bindAddress: BIND_ADDRESS,
  isLocal: !NAMESPACE,
  logLevel: LOG_LEVEL,
  mongoUri: MONGO_URI,
});
