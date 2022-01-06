const config = require('./defaultConfig');
if (JSON.parse(config.env_vars.FULL_SOURCEMAPS) === 'false')
  config.sourceMapsConfig.exclude = /vendors.*.*/;
const exportObj = {
  publicPath: './',
  configureWebpack: config.webpackConfig,
  lintOnSave: process.env.NODE_ENV === 'production' ? 'error' : true,
  integrity: process.env.WEBPACK_INTEGRITY === 'false' ? false : true,
  productionSourceMap: true,
  pages: {
    index: {
      entry: 'src/main/offlineMain.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  }
};

module.exports = exportObj;
