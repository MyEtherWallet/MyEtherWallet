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
          'src/wallets/hybrid/MEWconnect/deterministicWalletPaths.js',
          'src/wallets/hardware/deterministicWalletPaths.js',
          // UnusedFilesWebpackPlugin marked the below files as unused
          'src/components/DropDownAddressSelector/',
          'src/components/Transactions/TransactionEntry/',
          'src/dapps/RegisterDomain/components/FinalizeModal/',
          'src/layouts/InterfaceLayout/components/ProvidersRadioSelector/',
          'src/layouts/InterfaceLayout/SwapContainer/',
          'src/assets/images/currency/coins/',
          'src/builds/',
          'src/components/Transactions/',
          'src/partners/',
          'src/components/Transactions/TransactionEntry/index.js',
          'src/components/Transactions/TransactionEntry/TransactionEntry.scss',
          'src/assets/images/etc/changelly.png',
          'src/assets/images/etc/simplex.png',
          'src/builds/chrome-extension/files/img/icons/icon128.png',
          'src/builds/chrome-extension/files/img/icons/icon16.png',
          'src/builds/chrome-extension/files/img/icons/icon192.png',
          'src/builds/chrome-extension/files/img/icons/icon32.png',
          'src/builds/chrome-extension/files/img/icons/icon48.png',
          'src/builds/chrome-extension/files/manifest.json',
          'src/components/Transactions/index.js',
          'src/components/Transactions/TransactionEntry/TransactionEntry.vue',
          'src/components/Transactions/Transactions.scss',
          'src/components/Transactions/Transactions.vue',
          'src/builds/web/storage/index.js',
          // Pre-Commit Build (12-2-18 3:37 PM)
          'src/assets/images/currency/coins/AllImages/_icon-config.json',
          'src/assets/images/currency/coins/asFont/cryptocoins.less',
          'src/assets/images/currency/coins/webfont/cryptocoins-colors.css',
          'src/App.scss',
          'src/App.vue',
          'src/assets/images/background/bg-left.png',
          'src/assets/images/background/bg-right.png',
          'src/assets/images/currency/coins/asFont/cryptocoins.json',
          'src/assets/images/icons/arrow-green-right.svg',
          'src/assets/images/icons/ethereum-icon.png',
          'src/assets/images/icons/github-black.png',
          'src/assets/images/icons/slack.png',
          'src/components/ConfirmationModal/ConfirmationModal.scss',
          'src/components/ConfirmationModal/ConfirmationModal.vue',
          'src/components/ConfirmationModal/index.js',
          'src/components/DropDownBidCurrencySelector/DropDownBidCurrencySelector.scss',
          'src/components/DropDownBidCurrencySelector/DropDownBidCurrencySelector.vue',
          'src/components/DropDownBidCurrencySelector/index.js',
          'src/components/TransactionsDropdownMenu/index.js',
          'src/components/TransactionsDropdownMenu/TransactionsDropdownMenu.scss',
          'src/components/TransactionsDropdownMenu/TransactionsDropdownMenu.vue',
          'src/components/TxTopMenuPopup/components/TxInfoBlock/index.js',
          'src/components/TxTopMenuPopup/components/TxInfoBlock/TxInfoBlock.scss',
          'src/components/TxTopMenuPopup/components/TxInfoBlock/TxInfoBlock.vue',
          'src/components/TxTopMenuPopup/index.js',
          'src/components/TxTopMenuPopup/TxTopMenuPopup.scss',
          'src/components/TxTopMenuPopup/TxTopMenuPopup.vue',
          'src/layouts/DevelopmentResources/DevelopmentResources.scss',
          'src/layouts/DevelopmentResources/DevelopmentResources.vue',
          'src/layouts/DevelopmentResources/index.js',
          'src/layouts/InformationPages/AdvancedToolsLayout/AdvancedToolsLayout.scss',
          'src/layouts/InformationPages/AdvancedToolsLayout/AdvancedToolsLayout.vue',
          'src/layouts/InformationPages/AdvancedToolsLayout/index.js',
          'src/layouts/InformationPages/ExtensionsLayout/ExtensionsLayout.scss',
          'src/layouts/InformationPages/ExtensionsLayout/ExtensionsLayout.vue',
          'src/layouts/InformationPages/ExtensionsLayout/index.js',
          'src/layouts/InformationPages/MewGithubLayout/index.js',
          'src/layouts/InformationPages/MewGithubLayout/MewGithubLayout.scss',
          'src/layouts/InformationPages/MewGithubLayout/MewGithubLayout.vue',
          'src/layouts/InformationPages/PrivacyPolicyLayout/index.js',
          'src/layouts/InformationPages/PrivacyPolicyLayout/PrivacyPolicyLayout.scss',
          'src/layouts/InformationPages/PrivacyPolicyLayout/PrivacyPolicyLayout.vue',
          'src/layouts/InformationPages/TermsAndConditionsLayout/index.js',
          'src/layouts/InformationPages/TermsAndConditionsLayout/TermsAndConditionsLayout.scss',
          'src/layouts/InformationPages/TermsAndConditionsLayout/TermsAndConditionsLayout.vue',
          'src/layouts/TxStatusLayout/index.js',
          'src/layouts/TxStatusLayout/TxStatusLayout.scss',
          'src/layouts/TxStatusLayout/TxStatusLayout.vue',
          // Chrome Extension
          'src/builds/mewcx/app.vue',
          'src/builds/mewcx/files/img/icons/icon128.png',
          'src/builds/mewcx/files/img/icons/icon16.png',
          'src/builds/mewcx/files/img/icons/icon192.png',
          'src/builds/mewcx/files/img/icons/icon32.png',
          'src/builds/mewcx/files/img/icons/icon48.png',
          'src/builds/mewcx/files/manifest.json',
          'src/builds/mewcx/index.js'
        ]
      }
    })
  );
}
module.exports = {
  baseUrl: process.env.ROUTER_MODE === 'history' ? '/' : './',
  configureWebpack: webpackConfig,
  chainWebpack: config => {}
};
