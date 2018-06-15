'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
// const vueLoaderConfig = require('./vue-loader.conf')
// const {VueLoaderPlugin} = require('vue-loader')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}


module.exports = {

  name: 'webWorker',
  mode: "none",
  target: "webworker",
  context: path.resolve(__dirname, '../'),
  entry: {
    worker: './src/workers/wallet.worker.js'
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/worker.js'),
    // chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    chunkFilename: utils.assetsPath('js/worker.js'),
    globalObject: 'this'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      // 'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      // ...(config.dev.useEslint ? [createLintingRule()] : []),
      // {
      //   test: /\.vue$/,
      //   loader: 'vue-loader',
      //   options: vueLoaderConfig
      // },
      // {
      //   test: /\.worker\.js$/,
      //   use: { loader: 'worker-loader' }
      // },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')],
        // exclude: [resolve('workers')]
      },
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
