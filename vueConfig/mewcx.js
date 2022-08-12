const CopyWebpackPlugin = require('copy-webpack-plugin');
const env_vars = require('../ENV_VARS');
const path = require('path');
const defaultConfig = require('./defaultConfigs');
const webpackConfigCXWeb3 = {
  devtool: defaultConfig.devtool,
  entry: {
    cxWeb3: './src/builds/mewcx/cxHelpers/cxWeb3.js',
    contentScript: './src/builds/mewcx/cxHelpers/contentScript.js',
    background: './src/builds/mewcx/cxHelpers/background.js'
  },
  node: {
    process: true
  },
  optimization: {
    splitChunks: false
  },
  plugins: defaultConfig.plugins.concat([
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/builds/mewcx/public',
          transform: function (content, filePath) {
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
              json.browser_action.default_popup = `browserActionLoading.html`;
              Object.keys(json).forEach(key => {
                if (hasJSFile.includes(key)) {
                  if (Array.isArray(json[key])) {
                    if (typeof json[key][0] === 'object') {
                      json[key][0].js = json[key][0].js.map(item => {
                        return `/js/${item}`;
                      });
                    } else {
                      json[key][0] = `/js/${json[key][0]}`;
                    }
                  } else {
                    json[key].scripts[0] = `/js/${json[key].scripts[0]}`;
                  }
                }
              });

              // json.name =
              //   JSON.parse(env_vars.CX_PROD) === 'true'
              //     ? json.name
              //     : `${json.name} TEST`;
              // json.short_name =
              //   JSON.parse(env_vars.CX_PROD) === 'true'
              //     ? json.short_name
              //     : `${json.short_name} TEST`;

              return JSON.stringify(json, null, 2);
            }

            return content;
          }
        }
      ]
    })
  ])
};
const pluginOptions = {
  // configureMultiCompilerWebpack: [webpackConfigCXWeb3]
};
const exportObj = {
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    },
    browserAction: 'src/builds/mewcx/browserAction/browserAction.js',
    popup: 'src/builds/mewcx/popup/popup.js',
    page: {
      entry: 'src/builds/mewcx/public/page.js',
      template: 'src/builds/mewcx/public/page.html',
      filename: 'page.html',
      jsFolder: 'js/background.js'
    }
  },
  publicPath: './',
  configureWebpack: webpackConfigCXWeb3,
  lintOnSave: process.env.NODE_ENV === 'production' ? 'error' : true,
  integrity: true,
  pluginOptions,
  outputDir: path.resolve(__dirname, '../', 'chrome-extension'),
  filenameHashing: false,
  productionSourceMap: false,
  chainWebpack: config => {
    config.plugins.delete('pwa');
    config.plugins.delete('workbox');
  }
};
module.exports = exportObj;
