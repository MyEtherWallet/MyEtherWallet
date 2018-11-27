const ImageminPlugin = require('imagemin-webpack-plugin').default;
const webpack = require('webpack');
const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJS = require('uglify-es');
const env_vars = require('./ENV_VARS');
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
    new webpack.DefinePlugin(env_vars),
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
if (process.env.BUILD_TYPE === 'mewcx') {
  webpackConfig.plugins.push(
    new CopyWebpackPlugin([
      {
        from: 'src/builds/mewcx/files',
        transform: function(content, filePath) {
          if (filePath.split('.').pop() === ('js' || 'JS'))
            return UglifyJS.minify(content.toString()).code;
          if (filePath.replace(/^.*[\\\/]/, '') === 'manifest.json') {
            const version = require('./package.json').version;
            let json = JSON.parse(content);
            json.version = version;
            return JSON.stringify(json);
          } else return content;
        }
      }
    ])
  );
}
if (process.env.NODE_ENV === 'production') {
  webpackConfig.plugins.push(
    new UnusedFilesWebpackPlugin({
      patterns: ['src/**/*.*'],
      failOnUnused: false,
      globOptions: {
        ignore: [
          'src/assets/images/mew-screen.png',
          'src/assets/images/flags/countries.json',
          'src/assets/images/networks/esn.svg',
          'src/translations/README.md',
          'src/translations/terms-of-conditions/en_US.json',
          // UnusedFilesWebpackPlugin marked the below files as unused
          'src/components/Transactions/TransactionEntry/index.js',
          'src/dapps/RegisterDomain/components/FinalizeModal/FinalizeModal.scss',
          'src/dapps/RegisterDomain/components/FinalizeModal/FinalizeModal.vue',
          'src/dapps/RegisterDomain/containers/ManageENSContainer/ManageENSContainer.scss',
          'src/dapps/RegisterDomain/containers/ManageENSContainer/ManageENSContainer.vue',
          'src/assets/images/currency/coins/asFont/cryptocoins.eot',
          'src/assets/images/currency/coins/asFont/cryptocoins.less',
          'src/assets/images/currency/coins/AllImages/_icon-config.json',
          // Chrome Extension
          'src/builds/mewcx/app.vue',
          'src/builds/mewcx/files/img/icons/icon128.png',
          'src/builds/mewcx/files/img/icons/icon16.png',
          'src/builds/mewcx/files/img/icons/icon192.png',
          'src/builds/mewcx/files/img/icons/icon32.png',
          'src/builds/mewcx/files/img/icons/icon48.png',
          'src/builds/mewcx/files/manifest.json',
          'src/builds/mewcx/index.js',
          'src/builds/web/storage/index.js'
        ]
      }
    })
  );
}
module.exports = {
  baseUrl: './',
  configureWebpack: webpackConfig,
  chainWebpack: config => {}
};
