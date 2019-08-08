const CopyWebpackPlugin = require('copy-webpack-plugin');
const env_vars = require('../ENV_VARS');
const path = require('path');
const defaultConfig = require('./defaultConfigs');
const webpackConfig = {
  devtool: 'source-map',
  entry: {
    app: './src/main.js',
    contentScript: './src/builds/mewcx/cxHelpers/contentScript.js',
    background: './src/builds/mewcx/cxHelpers/background.js',
    cxWeb3: './src/builds/mewcx/cxHelpers/cxWeb3.js'
  },
  node: {
    process: true
  },
  plugins: defaultConfig.plugins.concat([
    new CopyWebpackPlugin([
      {
        from: 'src/builds/mewcx/public',
        transform: function(content, filePath) {
          // eslint-disable-next-line no-useless-escape
          if (filePath.replace(/^.*[\\\/]/, '') === 'manifest.json') {
            const version = JSON.parse(env_vars.VERSION);
            const json = JSON.parse(content);
            const hasExtra = version.indexOf('-');
            if (hasExtra !== -1) {
              const newVersion = version.substring(0, hasExtra);
              json.version = newVersion;
            } else {
              json.version = version;
            }
            json.browser_action.default_popup = `index.html#/popup`;
            return JSON.stringify(json, null, 2);
          }
          return content;
        }
      }
    ])
  ]),
  optimization: defaultConfig.optimization
};
const exportObj = {
  publicPath: './',
  configureWebpack: webpackConfig,
  lintOnSave: process.env.NODE_ENV === 'production' ? 'error' : true,
  integrity: true,
  pwa: defaultConfig.pwa,
  outputDir: path.resolve(__dirname, '../', 'chrome-extension'),
  filenameHashing: false,
  productionSourceMap: false,
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      // eslint-disable-next-line no-param-reassign
      args[0].excludeChunks = ['background', 'contentScript', 'cxWeb3'];
      return args;
    });
    config.plugins.delete('pwa');
    config.plugins.delete('workbox');
  }
};
module.exports = exportObj;
