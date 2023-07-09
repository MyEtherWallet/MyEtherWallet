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
      navigateFallback: '/index.html',
      navigateFallbackBlacklist: [/^\/pages/]
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
  chainWebpack: config => {
    // GraphQL Loader
    config.module
      .rule('graphql')
      .test(/\.graphql$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end();

    config.module
      .rule('transpile-walletconnect')
      .test(/node_modules\/@walletconnect\/.*\.js$/)
      .use('babel')
      .loader('babel-loader')
      .end();
    config.module
      .rule('transpile-eth2-keystore')
      .test(/node_modules\/@myetherwallet\/eth2-keystore\/.*\.js$/)
      .use('babel')
      .loader('babel-loader')
      .end();
    config.module
      .rule('transpile-web3modal')
      .test(/node_modules\/@web3modal\/.*\.js$/)
      .use('babel')
      .loader('babel-loader')
      .end();
    config.module
      .rule('transpile-chainsafe')
      .test(/node_modules\/@chainsafe\/.*\.js$/)
      .use('babel')
      .loader('babel-loader')
      .end();
  }
};

module.exports = exportObj;
