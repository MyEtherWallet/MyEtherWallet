// package-test.js: check to make sure that all dependcies are sufficiently up
// to date. If dependencies are too outdated, exit with an error, failing `npm
// run update:packages` and thus eventually the entire build.

const package = require('./package.json');
const packageJson = require('package-json');
const SAFE_TIME = 1000 * 1 * 60 * 60 * 24 * 7; //7days
// babel-jest 24.0.0 is breaking all the tests [2-1-19]
//@xkeshi/vue-qrcode no longer maintained, forked out to mew
//multicoin-address-validator not enough downloads
// waiting for vee-validate 3.0 to be more stable (https://github.com/baianat/vee-validate/issues/2248)
// Matching exceptions with package.json
// Lock @vue packages due to complications on updating
// @vue/test-utils - breaking tests beginning at 5.2.5-hotfix-2 (with version 1.0.0-beta.30)
// @aave/protocol-js - freezes the whole page
const EXCEPTIONS = [
  'postcss-import',
  'postcss-url',
  'webpack',
  'canvas',
  'ethereum-ens',
  'babel-jest',
  'multicoin-address-validator',
  'vee-validate',
  '@xkeshi/vue-qrcode',
  '@vue/test-utils',
  'graphql',
  '@myetherwallet/eth-token-balance',
  '@makerdao/dai',
  'bootstrap-vue',
  'web3',
  'web3-core-helpers',
  'web3-core-method',
  'web3-core-requestmanager',
  'web3-utils',
  'i18n-iso-countries',
  '@myetherwallet/mewconnect-web-client',
  '@walletconnect/browser',
  '@walletconnect/qrcode-modal',
  'ethereumjs-wallet',
  '@makerdao/dai-plugin-mcd',
  '@makerdao/dai-plugin-migrations',
  'ethereumjs-util',
  '@makerdao/dai-plugin-migrations',
  'worker-loader',
  'eslint-plugin-vue',
  '@vue/cli-plugin-babel',
  '@vue/cli-plugin-eslint',
  '@vue/cli-plugin-pwa',
  '@vue/cli-plugin-unit-jest',
  '@vue/cli-service',
  'postcss-import',
  'postcss-url',
  'webpack',
  'copy-webpack-plugin',
  '@aave/protocol-js',
  // look into updating this after release
  'is-ipfs',
  '@stripe/stripe-js',
  // probably hold off on these ones until next iteration
  '@sentry/browser',
  '@sentry/integrations',
  'sass-loader',
  'stylelint',
  'stylelint-config-standard',
  'vue-stripe-elements-plus',
  'node-sass', // 5-25-21
  'prettier', // 5-26-21
  '@ledgerhq/hw-app-eth', // 7-2-21 major version change
  '@ledgerhq/hw-transport-webusb', // 7-2-21 major version change
  'package-json', // 7-2-21 major version change
  'luxon', // 7-20-21 major version change
  'remark-cli',
  'remark-preset-lint-recommended',
  'node-fetch', // 10-4-21 major version change
  'eslint-plugin-prettier', // 10-4-21 major version change
  'marked', // 10-4-21 major version change
  '@unstoppabledomains/resolution', // 01-31-22 major version change
  'chart.js',
  'core-js',
  'html2canvas',
  'subscriptions-transport-ws',
  'unicode',
  '@ensdomains/address-encoder',
  '@vue/eslint-config-prettier',
  'axios',
  'fuse.js',
  'imagemin-mozjpeg',
  'vue-i18n',
  'stylelint-config-prettier',
  'moment',
  'vue',
  'vue-chartjs',
  'vue-router',
  'vuex',
  'walletlink',
  'xss',
  'bitbox02-api',
  'eslint',
  'eslint-plugin-security',
  'jest-canvas-mock',
  'sinon',
  'trezor-connect',
  'vue-template-compiler',
  'moment-timezone',
  'bignumber.js'
];
const CUSTOM_DIST = {
  ['babel-core']: 'bridge'
};
const ALL_PACKAGES = Object.assign(
  package.dependencies,
  package.devDependencies
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
      if (
        ALL_PACKAGES[_name] !== latestVersion &&
        new Date(latestVersionTime).getTime() < new Date().getTime() - SAFE_TIME
      ) {
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
    })
    .then(looper);
};
looper();
