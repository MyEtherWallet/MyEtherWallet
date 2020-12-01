const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJS = require('uglify-es');
const env_vars = require('../ENV_VARS');
const defaultConfigs = require('./defaultConfigs');
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
    })
  ]),
  optimization: defaultConfigs.optimization
};
const exportObj = {
  publicPath: process.env.ROUTER_MODE === 'history' ? '/' : './',
  configureWebpack: webpackConfig,
  lintOnSave: process.env.NODE_ENV === 'production' ? 'error' : true,
  integrity: false,
  pwa: defaultConfigs.pwa
};
module.exports = exportObj;
