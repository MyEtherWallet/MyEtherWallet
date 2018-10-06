const Dotenv = require('dotenv-webpack');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const webpack = require('webpack');
const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin');
const webpackConfig = {
  node: {
    process: true
  },
  devServer: {
    https: true,
    host: 'localhost',
    hotOnly: true,
    port: 8080
  },
  plugins: [
    new Dotenv({
      systemvars: true,
      silent: true
    }),
    new webpack.NormalModuleReplacementPlugin(/^any-promise$/, 'bluebird'),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      disable: process.env.NODE_ENV !== 'production',
      pngquant: {
        quality: '95-100'
      }
    })
  ]
};
if (process.env.NODE_ENV === 'production') {
  webpackConfig.plugins.push(new UnusedFilesWebpackPlugin({
      patterns: ['src/**/*.*'],
      failOnUnused: true,
      globOptions: {
        ignore: [
          'src/assets/images/flags/countries.json',
          'src/assets/images/networks/esn.svg',
          'src/translations/README.md',
          'src/translations/terms-of-conditions/en_US.json',
          'src/wallets/hybrid/MEWconnect/deterministicWalletPaths.js',
          'src/wallets/hardware/deterministicWalletPaths.js'
        ]
      }
    }));
}
module.exports = {
  baseUrl: './',
  configureWebpack: webpackConfig,
  chainWebpack: config => {
    config.module
      .rule('eslint')
      .use('eslint-loader')
      .options({ fix: true });
  }
};
