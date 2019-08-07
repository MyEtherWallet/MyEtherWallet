const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJS = require('uglify-es');
const env_vars = require('../ENV_VARS');
const path = require('path');
const defaultConfig = require('./defaultConfigs');
const webpackConfig = {
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
        from: 'src/builds/' + JSON.parse(env_vars.BUILD_TYPE) + '/public',
        flatten: true,
        transform: function(content, filePath) {
          if (filePath.split('.').pop() === ('js' || 'JS'))
            return UglifyJS.minify(content.toString()).code;
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
            if (process.env.NODE_ENV === 'production') {
              json.browser_action.default_popup = `index.html#/popup`;
              json.background.scripts = json.background.scripts.map(item => {
                return `js/${item}`;
              });
              json.content_scripts[0].js = json.content_scripts[0].js.map(
                item => {
                  return `js/${item}`;
                }
              );
              json.web_accessible_resources = json.web_accessible_resources.map(
                item => {
                  return `js/${item}`;
                }
              );
            }
            json.browser_action.default_icon = json.browser_action.default_icon.replace(
              'img/icons/',
              ''
            );
            Object.keys(json.icons).forEach(item => {
              json.icons[item] = json.icons[item].replace('img/icons/', '');
            });
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
  }
};
module.exports = exportObj;
