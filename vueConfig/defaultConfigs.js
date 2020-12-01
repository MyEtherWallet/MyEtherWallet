const imageminMozjpeg = require('imagemin-mozjpeg');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const webpack = require('webpack');
const env_vars = require('../ENV_VARS');
const allowedConnections = require('./connections');
const sourceMapsConfig = {
  filename: 'sourcemaps/[file].map'
};
if (JSON.parse(env_vars.FULL_SOURCEMAPS) === 'false')
  sourceMapsConfig.exclude = /vendors.*.*/;
module.exports = {
  devtool: false,
  plugins: [
    new webpack.SourceMapDevToolPlugin(sourceMapsConfig),
    new webpack.DefinePlugin(env_vars),
    new webpack.NormalModuleReplacementPlugin(/^any-promise$/, 'bluebird'),
    new ImageminPlugin({
      disable: process.env.NODE_ENV !== 'production',
      test: /\.(jpe?g|png|gif|svg)$/i,
      pngquant: {
        quality: '100'
      },
      plugins: [
        imageminMozjpeg({
          quality: 100,
          progressive: true
        })
      ]
    })
  ],
  headers: {
    'Strict-Transport-Security': 'max-age=63072000; includeSubdomains; preload',
    'Content-Security-Policy':
      "default-src 'self' blob:; frame-src 'self' www.walletlink.org:443 connect.trezor.io:443 viewm.moonicorn.network:443 *.stripe.com:443; img-src 'self' img.mewapi.io:443 nft2.mewapi.io:443 cdn.stateofthedapps.com:443 data: blob:; script-src 'unsafe-eval' 'unsafe-inline' blob: https:; style-src 'self' 'unsafe-inline' https:; object-src 'none'; connect-src " +
      allowedConnections.join(' ') +
      ';',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'same-origin'
  },
  pwa: {
    name: 'MyEtherWallet',
    workboxOptions: {
      importWorkboxFrom: 'local',
      skipWaiting: true,
      clientsClaim: true,
      navigateFallback: '/index.html'
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors'
        }
      }
    }
  }
};
