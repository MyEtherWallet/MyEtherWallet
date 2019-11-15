const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
    new HtmlWebpackPlugin({
      template: './src/builds/mewcx/public/page.html',
      templateParameters: {
        jsFolder:
          process.env.NODE_ENV === 'production'
            ? 'js/background.js'
            : 'background.js'
      },
      filename: 'page.html',
      excludeChunks: [
        'index',
        'popup',
        'browserAction',
        'contentScript',
        'cxWeb3',
        'app',
        'background',
        'chunk-common',
        'chunk-vendors'
      ]
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/builds/mewcx/public',
        transform: function(content, filePath) {
          // eslint-disable-next-line no-useless-escape
          if (filePath.replace(/^.*[\\\/]/, '') === 'manifest.json') {
            const version = JSON.parse(env_vars.VERSION);
            const json = JSON.parse(content);
            const hasExtra = version.indexOf('-');
            const hasJSFile = ['content_scripts', 'web_accessible_resources'];
            if (hasExtra !== -1) {
              const newVersion = version.substring(0, hasExtra);
              json.version = newVersion;
            } else {
              json.version = version;
            }
            json.browser_action.default_popup = `browserAction.html`;
            Object.keys(json).forEach(key => {
              if (hasJSFile.includes(key)) {
                if (Array.isArray(json[key])) {
                  if (typeof json[key][0] === 'object') {
                    json[key][0].js = json[key][0].js.map(item => {
                      return `${
                        process.env.NODE_ENV === 'production'
                          ? '/js/' + item
                          : item
                      }`;
                    });
                  } else {
                    json[key][0] =
                      process.env.NODE_ENV === 'production'
                        ? '/js/' + json[key][0]
                        : json[key][0];
                  }
                } else {
                  json[key].scripts[0] =
                    process.env.NODE_ENV === 'production'
                      ? '/js/' + json[key].scripts[0]
                      : json[key].scripts[0];
                }
              }
            });

            return JSON.stringify(json, null, 2);
          }

          return content;
        }
      }
    ])
  ])
};
const exportObj = {
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    },
    browserAction: {
      entry: 'src/builds/mewcx/browserAction/browserAction.js',
      template: 'public/index.html',
      filename: 'browserAction.html',
      chunks: ['browserAction']
    },
    popup: {
      entry: 'src/builds/mewcx/popup/popup.js',
      template: 'public/index.html',
      filename: 'popup.html',
      chunks: ['popup']
    }
  },
  publicPath: './',
  configureWebpack: webpackConfig,
  lintOnSave: process.env.NODE_ENV === 'production' ? 'error' : true,
  integrity: true,
  pwa: defaultConfig.pwa,
  outputDir: path.resolve(__dirname, '../', 'chrome-extension'),
  filenameHashing: false,
  productionSourceMap: false,
  chainWebpack: config => {
    config.plugins.delete('pwa');
    config.plugins.delete('workbox');
  }
};
module.exports = exportObj;
