// package-test.js: check to make sure that all dependencies are sufficiently up
// to date. If dependencies are too outdated, exit with an error, failing `npm
// run update:packages` and thus eventually the entire build.

const parsedPackage = require('./package.json');
const packageJson = require('package-json');
const SAFE_TIME = 1000 * 1 * 60 * 60 * 24 * 7; //7days
// webpack has a major update
// copy-webpack-plugin major update
// holding off on husky changes as the cli still has some weird necessary changes to run commitlint
const EXCEPTIONS = [
  'multicoin-address-validator',
  'postcss-import',
  'postcss-url',
  'webpack',
  'copy-webpack-plugin',
  'sass',
  'sass-loader',
  'husky',
  '@aave/protocol-js',
  'sass',
  'web3',
  'web3-core-helpers',
  'web3-core-method',
  'web3-core-requestmanager',
  'web3-utils',
  'remark-cli',
  'node-fetch',
  'vuetify',
  'vue-i18n',
  'stylelint',
  'stylelint-config-standard',
  'vue',
  'vue-router',
  'vuex',
  'eslint',
  'eslint-plugin-vue',
  'imagemin-mozjpeg', // issue with importing it to vue config will look into it more if we need it
  // versions for vue3
  '@vue/eslint-config-prettier', // creates more warnings
  '@vue/test-utils',
  '@vue/babel-preset-app',
  '@vue/cli-plugin-babel',
  '@vue/cli-plugin-eslint',
  '@vue/cli-plugin-pwa',
  '@vue/cli-plugin-unit-jest',
  '@vue/cli-service',
  'vue-i18n',
  'vue',
  '@vue/cli-plugin-e2e-nightwatch',
  '@kleros/address-tags-sdk',
  'package-json',
  'codecov',
  'node-polyfill-webpack-plugin',
  '@lokalise/node-api',
  '@unstoppabledomains/resolution',
  '@walletconnect/client',
  '@walletconnect/qrcode-modal',
  'chromedriver',
  '@ethereumjs/common',
  '@ethereumjs/tx',
  'graphql',
  'vue-lazyload',
  '@ensdomains/ensjs',
  'vue-template-compiler',
  '@aave/contract-helpers',
  '@aave/math-utils',
  'node-sass',
  '@ledgerhq/hw-transport-web-ble',
  '@ledgerhq/hw-transport-webusb',
  '@ledgerhq/hw-app-eth',
  'uuid',
  'web3-eth-contract',
  'is-ipfs',
  'axios',
  'prettier', // creates more warnings
  '@ledgerhq/live-common', // issue with imports
  'bip39', // breaks
  'ethers', // major update
  'patch-package', // major update
  'highcharts', // major update
  'highcharts-vue', // major update for vue 3
  'geckodriver',
  'eslint-plugin-prettier', // breaks
  'ethereum-block-by-date',
  '@mathieustan/vue-intercom', // major version
  'vue-chartjs',
  'chart.js',
  'vue-tippy',
  'less-loader', // doesn't support webpack 4
  'eslint-plugin-security', // part of major release for eslint
  '@commitlint/config-conventional',
  'commitlint',
  'minizlib',
  'remark-preset-lint-recommended', // breaks
  '@sentry/browser', // major update
  '@sentry/vue', // major update
  'qrcode-with-logos', // fix after release
  '@ensdomains/ens-contracts',
  '@shapeshiftoss/hdwallet-core',
  '@shapeshiftoss/hdwallet-keepkey-webusb',
  '@trezor/connect-web',
  '@walletconnect/modal',
  '@walletconnect/ethereum-provider'
];
const CUSTOM_DIST = {
  ['babel-core']: 'bridge'
};
const ALL_PACKAGES = Object.assign(
  parsedPackage.dependencies,
  parsedPackage.devDependencies
);
const names = Object.keys(ALL_PACKAGES);
let updatesFound = false;
const looper = () => {
  if (!names.length) {
    if (updatesFound) {
      console.error(
        '\nREFUSING TO CONTINUE because above packages are TOO FAR OUT OF DATE!'
      );
      console.error(
        'In order to build MyEtherWallet, you must edit package.json.'
      );
      console.error(
        'Update the versions for the packages above to their current versions.'
      );
      console.error('Then run `npm update`.');
      console.error();
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
  const _name = names.shift();
  if (EXCEPTIONS.includes(_name)) return looper();
  if (ALL_PACKAGES[_name].includes('^') || ALL_PACKAGES[_name].includes('~')) {
    console.error(
      'Invalid character ~ or ^ found in package.json version string, only fixed versions are allowed.'
    );
    process.exit(1);
  }
  packageJson(_name, {
    fullMetadata: true,
    allVersions: true
  })
    .then(info => {
      const latestVersion = info['dist-tags'][CUSTOM_DIST[_name] || 'latest'];
      const latestVersionTime = info['time'][latestVersion];
      if (ALL_PACKAGES[_name] !== latestVersion) {
        const isBehind =
          new Date(latestVersionTime).getTime() <
          new Date().getTime() - SAFE_TIME;
        if (isBehind) {
          console.error(
            'ERROR: Update ' +
              _name +
              ' from ' +
              ALL_PACKAGES[_name] +
              ' to ' +
              latestVersion +
              '. Released:',
            latestVersionTime
          );
          updatesFound = true;
        }
      }
    })
    .then(looper);
};
looper();
