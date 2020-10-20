const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJS = require('uglify-es');
const env_vars = require('../ENV_VARS');
const defaultConfigs = require('./defaultConfigs');

const PrerenderSpaPlugin = require('prerender-spa-plugin');
const path = require('path');

const productionPlugins = [
  new PrerenderSpaPlugin({
    staticDir: '/home/steve/mew/z_SCRAPs/MyEtherWallet/dist',
    routes: ['/'],
    postProcess (renderedRoute) {
      // Ignore any redirects.
      renderedRoute.route = renderedRoute.originalRoute
      // Basic whitespace removal. (Don't use this in production.)
      renderedRoute.html = renderedRoute.html.split(/>[\s]+</gmi).join('><')
      // Remove /index.html from the output path if the dir name ends with a .html file extension.
      // For example: /dist/dir/special.html/index.html -> /dist/dir/special.html
      if (renderedRoute.route.endsWith('.html')) {
        renderedRoute.outputPath = path.join(__dirname, 'dist', renderedRoute.route)
      }

      return renderedRoute
    },
    renderer: new PrerenderSpaPlugin.PuppeteerRenderer({
      injectProperty: '__PRERENDER_INJECTED',
      // We need to inject a value so we're able to
      // detect if the page is currently pre-rendered.
      inject: {},
      // Our view component is rendered after the API
      // request has fetched all the necessary data,
      // so we create a snapshot of the page after the
      // `data-view` attribute exists in the DOM.
      // renderAfterElementExists: '[data-view]',
      headless: false,
      maxConcurrentRoutes: 40,
      ignoreHTTPSErrors: true,
      devtools: true,
      renderAfterElementExists: '#app'
      // renderAfterDocumentEvent: 'render-event'
    }),
  }),
];

const webpackConfig = {
  devtool: defaultConfigs.devtool,
  node: {
    process: true
  },
  devServer: {
    https: true,
    host: 'localhost',
    hotOnly: true,
    port: 8080,
    headers: defaultConfigs.headers
  },
  plugins: defaultConfigs.plugins.concat([
    new CopyWebpackPlugin({
      patterns: [
        { from: 'security.txt', to: '.well-known/security.txt' },
        {
          from: 'src/builds/' + JSON.parse(env_vars.BUILD_TYPE) + '/public',
          transform: function (content, filePath) {
            if (filePath.split('.').pop() === ('js' || 'JS'))
              return UglifyJS.minify(content.toString()).code;
            return content;
          }
        }
      ]
    }),
    ...productionPlugins
  ]),
  optimization: defaultConfigs.optimization
};
const exportObj = {
  publicPath: process.env.ROUTER_MODE === 'history' ? '/' : './',
  configureWebpack: webpackConfig,
  lintOnSave: process.env.NODE_ENV === 'production' ? 'error' : true,
  integrity: process.env.WEBPACK_INTEGRITY === 'false' ? false : true,
  pwa: defaultConfigs.pwa
};
module.exports = exportObj;
