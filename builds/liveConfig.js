const config = require('./defaultConfig');
if (JSON.parse(config.env_vars.FULL_SOURCEMAPS) === 'false')
  config.sourceMapsConfig.exclude = /vendors.*.*/;

const exportObj = {
  publicPath: process.env.ROUTER_MODE === 'history' ? '/' : './',
  configureWebpack: config.webpackConfig,
  lintOnSave: process.env.NODE_ENV === 'production' ? 'error' : true,
  integrity: process.env.WEBPACK_INTEGRITY === 'false' ? false : true,
  pwa: {
    name: 'MyEtherWallet',
    workboxOptions: {
      importWorkboxFrom: 'local',
      skipWaiting: true,
      clientsClaim: true,
      exclude: [/index\.html$/]
    },
    iconPaths: {
      faviconSVG: 'icons/favicon.svg',
      favicon32: 'icons/favicon-32x32.png',
      favicon16: 'icons/favicon-16x16.png',
      appleTouchIcon: 'icons/apple-touch-icon-152x152.png',
      maskIcon: 'icons/safari-pinned-tab.svg',
      msTileImage: 'icons/msapplication-icon-144x144.png'
    }
  },
  chainWebpack: config.transpilers
};

module.exports = exportObj;
