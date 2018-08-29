const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
module.exports = {
  // baseUrl: '',
  configureWebpack: {
    node: {
      process: true
    },
    output: {
      globalObject: 'this'
    },
    devServer: {
      https: true,
      host: '0.0.0.0',
      port: 8080
    },
    plugins: [
      new Dotenv({
        systemvars: true,
        silent: true
      }),
      new webpack.NormalModuleReplacementPlugin(/^any-promise$/, 'bluebird')
    ]
  },
  chainWebpack: config => {
    config.module
      .rule('eslint')
      .use('eslint-loader')
      .options({ fix: true });
  }
};
