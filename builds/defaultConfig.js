const imageminMozjpeg = require('imagemin-mozjpeg');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const UglifyJS = require('uglify-es');
const env_vars = require('../ENV_VARS');
const allowedConnections = require('../connections');

const sourceMapsConfig = {
  filename: 'sourcemaps/[file].map'
};

const webpackConfig = {
  devtool: false,
  node: {
    process: true
  },
  devServer: {
    https: true,
    host: 'localhost',
    hotOnly: true,
    port: 8080,
    headers: {
      'Strict-Transport-Security':
        'max-age=63072000; includeSubdomains; preload',
      'Content-Security-Policy':
        "font-src 'self' data: js.intercomcdn.com:443 fonts.intercomcdn.com:443; media-src js.intercomcdn.com:443 'self'; default-src 'self' blob:; frame-src 'self' verify.walletconnect.com:443 www.walletlink.org:443 connect.trezor.io:443 intercom-sheets.com:443; img-src 'self' downloads.intercomcdn.com:443 www.mewtopia.com:443 gifs.intercomcdn.com:443 js.intercomcdn.com:443 images.ctfassets.net static.intercomassets.com:443 nft.mewapi.io:443 mewcard.mewapi.io:443 img.mewapi.io:443 app.lokalise.com:443 explorer-api.walletconnect.com:443 data: blob: ; script-src 'unsafe-eval' 'unsafe-inline' blob: https:; style-src 'self' 'unsafe-inline' https:; object-src 'none'; connect-src " +
        allowedConnections.join(' ') +
        ';',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'same-origin'
    }
    // compress: true // enable when testing local optimization
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin(sourceMapsConfig),
    new webpack.NormalModuleReplacementPlugin(/^any-promise$/, 'bluebird'),
    // new BundleAnalyzerPlugin(),
    new ImageminPlugin({
      disable: process.env.NODE_ENV !== 'production',
      test: /\.(jpe?g|png|gif|svg)$/i,
      pngquant: {
        quality: '100'
      },
      plugins: [
        imageminMozjpeg({
          quality: 100,
          progressive: true,
          chunks: 'all'
        })
      ]
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'security.txt', to: '.well-known/security.txt' },
        {
          from: 'public',
          transform: function (content, filePath) {
            if (filePath.split('.').pop() === ('js' || 'JS'))
              return UglifyJS.minify(content.toString()).code;
            return content;
          }
        }
      ]
    }),
    new webpack.DefinePlugin(env_vars),
    new CompressionWebpackPlugin()
  ],
  optimization: {
    splitChunks: {
      minSize: 1000000,
      maxSize: 5242880
    },
    chunkIds: 'size',
    concatenateModules: true,
    mergeDuplicateChunks: true,
    minimize: true,
    moduleIds: 'size',
    removeAvailableModules: true,
    removeEmptyChunks: true
  },
  output: {
    filename: '[name].[hash].js'
  }
};

const transpilers = config => {
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
  config.module
    .rule('transpile-ledger')
    .test(/node_modules\/@ledgerhq\/.*\.js$/)
    .use('babel')
    .loader('babel-loader')
    .end();
  config.module
    .rule('resolve-alias')
    .test(/node_modules\/@ledgerhq\/.*\.js$/)
    .resolve.alias.set('@ledgerhq/devices', '@ledgerhq/devices/lib-es')
    .set('@ledgerhq/cryptoassets', '@ledgerhq/cryptoassets/lib-es')
    .set(
      '@ledgerhq/domain-service/signers',
      '@ledgerhq/domain-service/lib-es/signers'
    )
    .end();

  // disable if statement if testing optimization locally
  if (process.env.NODE_ENV === 'production') {
    // remove prefetch for build
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');
  }
};

module.exports = { webpackConfig, sourceMapsConfig, env_vars, transpilers };
