// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const withRoot = (...args) => path.join(__dirname, ...args);

const ts = () => ({
  test: /\.(t|m?j)sx?$/,
  exclude: [/node_modules\/(?!@cerbero).*/],
  include: [/@cerbero/, /src/],
  use: [
    {
      loader: require.resolve('ts-loader'),
      options: {
        configFile: withRoot('tsconfig.build.json'),
        allowTsInNodeModules: true,
      },
    },
  ],
});

module.exports = () => {
  const context = withRoot('.');
  const devtool = 'source-map';
  const entry = { main: ['./src/main'] };
  const extensions = ['.ts', '.js', '.json', '.tsx'];
  const mode = process.env.NODE_ENV || 'development';
  const path = withRoot('dist');
  const target = 'node';

  const rules = [ts()];

  return {
    context,
    entry,
    externals: [/^(?!@(cerbero))[a-z0-9@-].+$/i],
    devtool,
    mode,
    module: { rules },
    output: { path, libraryTarget: 'commonjs2' },
    resolve: { extensions },
    target,
  };
};
