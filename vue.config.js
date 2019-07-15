const imageminMozjpeg = require('imagemin-mozjpeg');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const webpack = require('webpack');
const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJS = require('uglify-es');
const env_vars = require('./ENV_VARS');
const path = require('path');
const webpackConfig = {
  entry: {
    app: './src/main.js',
    contentScript: './src/builds/mewcx/cxHelpers/contentScript.js',
    background: './src/builds/mewcx/cxHelpers/background.js',
    cxWeb3: './src/builds/mewcx/cxHelpers/cxWeb3.js'
  },
  node: {
    process: true
  },
  devServer: {
    // disableHostCheck: true, // Dev purposes only, should be commented out before release
    https:  true,
    host: 'localhost',
    hotOnly: JSON.parse(env_vars.BUILD_TYPE) !== 'mewcx',
    port: 8080,
    writeToDisk: JSON.parse(env_vars.BUILD_TYPE) === 'mewcx',
    headers: {
      'Strict-Transport-Security':
        'max-age=63072000; includeSubdomains; preload',
      'Content-Security-Policy':
        "default-src 'self' blob:; frame-src 'self' connect.trezor.io:443; img-src 'self' data: blob:; script-src 'unsafe-eval' 'unsafe-inline' blob: https:; style-src 'self' 'unsafe-inline' https:; object-src 'none'; connect-src *;",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'same-origin'
    }
  },
  plugins: [
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
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'initial'
        }
      }
    }
  }
};

if (process.env.NODE_ENV === 'production') {
  webpackConfig.plugins.push(
    new UnusedFilesWebpackPlugin({
      patterns: ['src/**/*.*'],
      failOnUnused: true,
      globOptions: {
        ignore: require(`./ignore-list-${JSON.parse(env_vars.BUILD_TYPE)}.js`)
      }
    })
  );

  webpackConfig.devtool = 'source-map';
}
const pwa = {
  name: 'MyEtherWallet',
  workboxOptions: {
    importWorkboxFrom: 'local',
    skipWaiting: true,
    clientsClaim: true,
    navigateFallback: '/index.html'
  }
};
const exportObj = {
  publicPath: process.env.ROUTER_MODE === 'history' ? '/' : './',
  configureWebpack: webpackConfig,
  lintOnSave: process.env.NODE_ENV === 'production' ? 'error' : true,
  integrity: process.env.WEBPACK_INTEGRITY === 'false' ? false : true,
  pwa: pwa,
  chainWebpack: config => {
    config
      .plugin('html')
      .tap((args) => {
        // eslint-disable-next-line no-param-reassign
        args[0].excludeChunks = ['phishingManager', 'background', 'web3Manager', 'cxWeb3'];
        return args;
      });
    config.module
      .rule('replace')
      .test(/\.js$/)
      .include.add(
        path.resolve(__dirname, 'node_modules/@ensdomains/dnsprovejs')
      )
      .end()
      .use('string-replace-loader')
      .loader('string-replace-loader')
      .tap(() => {
        return {
          search:
            'https://dns.google.com/experimental?ct=application/dns-udpwireformat&dns=',
          replace:
            'https://cloudflare-dns.com/dns-query?ct=application/dns-udpwireformat&dns='
        };
      });
  }
};

if (JSON.parse(env_vars.BUILD_TYPE) === 'mewcx') {
  delete exportObj['configureWebpack'].optimization.splitChunks;
  exportObj['outputDir'] = path.resolve(__dirname, 'chrome-extension');
  exportObj['filenameHashing'] = false;
  exportObj['productionSourceMap'] = false;
  exportObj['configureWebpack'].optimization.splitChunks = false;
  exportObj['configureWebpack'].optimization.minimize = false;
  exportObj['configureWebpack'].output = {
    path: path.resolve(__dirname, 'chrome-extension'),
    filename: '[name].js'
  };
  exportObj['configureWebpack'].plugins.push(new CopyWebpackPlugin([
    {
      from: 'src/builds/' + JSON.parse(env_vars.BUILD_TYPE) + '/public',
      transform: function(content, filePath) {
        if (filePath.split('.').pop() === ('js' || 'JS'))
          return UglifyJS.minify(content.toString()).code;
        if (
          filePath.replace(/^.*[\\\/]/, '') === 'manifest.json' &&
          JSON.parse(env_vars.BUILD_TYPE) === 'mewcx'
        ) {
          const version = require('./package.json').version;
          const json = JSON.parse(content);
          const hasExtra = version.indexOf('-');
          if (hasExtra !== -1) {
            const newVersion = version.substring(0, hasExtra);
            json.version = newVersion;
          } else {
            json.version = version;
          }
          // json.background.scripts = json.background.scripts.map(item => {
          //   return `js/${item}`;
          // });

          // json.content_scripts[0].js = json.content_scripts[0].js.map(item => {
          //   return `js/${item}`;
          // });

          // json.web_accessible_resources = json.web_accessible_resources.map(item => {
          //   return `js/${item}`;
          // });
          return JSON.stringify(json, null, 2);
        }
        return content;
      }
    }
  ]));
}
module.exports = exportObj;
