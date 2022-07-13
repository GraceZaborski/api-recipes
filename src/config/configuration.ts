const { PORT = 8080, BIND_ADDRESS = '0.0.0.0' } = process.env;

export default () => ({
  port: PORT,
  bindAddress: BIND_ADDRESS,
});
