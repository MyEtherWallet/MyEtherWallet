const imageminMozjpeg = require('imagemin-mozjpeg');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const webpack = require('webpack');
const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJS = require('uglify-es');
const env_vars = require('./ENV_VARS');
const path = require('path');
const webpackConfig = {
  node: {
    process: true
  },
  devtool: 'source-map',
  devServer: {
    https: true,
    host: 'localhost',
    hotOnly: true,
    port: 8080,
    writeToDisk: JSON.parse(env_vars.BUILD_TYPE) === 'mewcx',
    headers: {
      'Strict-Transport-Security':
        'max-age=63072000; includeSubdomains; preload',
      'Content-Security-Policy':
        "default-src 'self' blob:; frame-src 'self' connect.trezor.io:443; img-src 'self' https://swap.mewapi.io data: blob: ; script-src 'unsafe-eval' 'unsafe-inline' blob: https:; style-src 'self' 'unsafe-inline' https:; object-src 'none'; connect-src *;",
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
    }),
    new CopyWebpackPlugin([
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
            json.version = version;
            return JSON.stringify(json, null, 2);
          }
          return content;
        }
      }
    ])
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
        ignore: [
          // Are we using these
          'src/assets/images/icons/question.png',
          'src/components/DropDownAddressSelector/DropDownAddressSelector.scss',
          'src/components/DropDownAddressSelector/index.js',
          'src/components/PopupHelper/index.js',
          'src/components/PopupHelper/PopupHelper.scss',
          'src/components/PopupHelper/PopupHelper.vue',
          'src/components/StandardInputSlot/index.js',
          'src/components/StandardInputSlot/StandardInputSlot.scss',
          'src/components/StandardInputSlot/StandardInputSlot.vue',
          // Unknown
          'src/contracts/contract-abi-etsc.json',
          'src/contracts/contract-abi-exp.json',
          'src/layouts/DevelopmentResources/DevelopmentResources.scss',
          'src/layouts/DevelopmentResources/DevelopmentResources.vue',
          'src/layouts/DevelopmentResources/index.js',
          'src/layouts/InterfaceLayout/containers/SendCurrencyContainer/SendCurrencyContainer-desktop.scss',
          'src/layouts/InterfaceLayout/containers/SendCurrencyContainer/SendCurrencyContainer-mobile.scss',
          'src/layouts/InterfaceLayout/containers/SendCurrencyContainer/SendCurrencyContainer-tablet.scss',
          'src/tokens/tokens-etsc.json',
          'src/tokens/tokens-exp.json',
          // Informational
          'src/translations/README.md',
          'src/App.scss',
          // Helpers page
          'src/layouts/InformationPages/PrivacyPolicyLayout/index.js',
          'src/layouts/InformationPages/PrivacyPolicyLayout/PrivacyPolicyLayout.scss',
          'src/layouts/InformationPages/PrivacyPolicyLayout/PrivacyPolicyLayout.vue',
          'src/layouts/InformationPages/TermsAndConditionsLayout/index.js',
          'src/layouts/InformationPages/TermsAndConditionsLayout/TermsAndConditionsLayout.scss',
          'src/layouts/InformationPages/TermsAndConditionsLayout/TermsAndConditionsLayout.vue',
          'src/layouts/InformationPages/AdvancedToolsLayout/AdvancedToolsLayout.scss',
          'src/layouts/InformationPages/AdvancedToolsLayout/AdvancedToolsLayout.vue',
          'src/layouts/InformationPages/AdvancedToolsLayout/index.js',
          'src/layouts/InformationPages/ExtensionsLayout/ExtensionsLayout.scss',
          'src/layouts/InformationPages/ExtensionsLayout/ExtensionsLayout.vue',
          'src/layouts/InformationPages/ExtensionsLayout/index.js',
          'src/layouts/InformationPages/MewGithubLayout/index.js',
          'src/layouts/InformationPages/MewGithubLayout/MewGithubLayout.scss',
          'src/layouts/InformationPages/MewGithubLayout/MewGithubLayout.vue',
          'src/components/DropDownBidCurrencySelector/DropDownBidCurrencySelector.scss',
          'src/components/DropDownBidCurrencySelector/DropDownBidCurrencySelector.vue',
          'src/components/DropDownBidCurrencySelector/index.js',
          'src/components/DropDownAddressSelector/DropDownAddressSelector.vue',
          'src/components/Notification/components/NotificationTypes/SwapNotification/index.js',
          'src/components/Notification/components/NotificationTypes/TransactionNotification/index.js',
          // Images
          'src/assets/images/etc/mewconnect.jpeg',
          'src/assets/images/icons/button-finney.png',
          'src/assets/images/background/bg-left.png',
          'src/assets/images/background/bg-right.png',
          'src/assets/images/currency/coins/AllImages/_icon-config.json',
          'src/assets/images/currency/coins/asFont/cryptocoins.json',
          'src/assets/images/currency/coins/asFont/cryptocoins.less',
          'src/assets/images/currency/coins/webfont/cryptocoins-colors.css',
          'src/assets/images/currency/coins/webfont/cryptocoins.css',
          'src/assets/images/flags/countries.json',
          'src/assets/images/icons/arrow-green-right.svg',
          'src/assets/images/icons/btc.png',
          'src/assets/images/icons/favicon.png',
          'src/assets/images/icons/github-black.png',
          'src/assets/images/icons/slack.png',
          'src/assets/images/mew-screen.png',
          'src/assets/images/networks/etsc.svg',
          'src/assets/images/networks/exp.svg',
          'src/assets/images/icons/up.svg',
          'src/assets/images/icons/button-json.svg',
          'src/assets/images/icons/button-mnemonic.svg',
          'src/assets/images/team/_blank_.jpg',
          // Chrome Extension
          'src/builds/mewcx/app.vue',
          'src/builds/mewcx/public/img/icons/icon128.png',
          'src/builds/mewcx/public/img/icons/icon16.png',
          'src/builds/mewcx/public/img/icons/icon192.png',
          'src/builds/mewcx/public/img/icons/icon32.png',
          'src/builds/mewcx/public/img/icons/icon48.png',
          'src/builds/mewcx/public/manifest.json',
          'src/builds/mewcx/index.js',
          'src/builds/web/public/img/icons/android-chrome-192x192.png',
          'src/builds/web/public/img/icons/android-chrome-512x512.png',
          'src/builds/web/public/img/icons/apple-touch-icon-120x120.png',
          'src/builds/web/public/img/icons/apple-touch-icon-152x152.png',
          'src/builds/web/public/img/icons/apple-touch-icon-180x180.png',
          'src/builds/web/public/img/icons/apple-touch-icon-60x60.png',
          'src/builds/web/public/img/icons/apple-touch-icon-76x76.png',
          'src/builds/web/public/img/icons/apple-touch-icon.png',
          'src/builds/web/public/img/icons/favicon-16x16.png',
          'src/builds/web/public/img/icons/favicon-32x32.png',
          'src/builds/web/public/img/icons/msapplication-icon-144x144.png',
          'src/builds/web/public/img/icons/mstile-150x150.png',
          'src/builds/web/public/img/icons/safari-pinned-tab.svg',
          'src/builds/web/public/img/spaceman.png',
          'src/builds/web/public/manifest.json',
          'src/builds/web/public/robots.txt'
        ]
      }
    })
  );
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
    config.module
      .rule('replace')
      .test(/\.js$/)
      .include.add(
        path.resolve(__dirname, 'node_modules/@ensdomains/dnsprovejs')
      )
      .end()
      .use('string-replace-loader')
      .loader('string-replace-loader')
      .tap(options => {
        return {
          search:
            'https://dns.google.com/experimental?ct=application/dns-udpwireformat&dns=',
          replace:
            'https://cloudflare-dns.com/dns-query?ct=application/dns-udpwireformat&dns='
        };
      });
  }
};
module.exports = exportObj;
