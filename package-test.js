// package-test.js: check to make sure that all dependcies are sufficiently up
// to date. If dependencies are too outdated, exit with an error, failing `npm
// run update:packages` and thus eventually the entire build.

const package = require('./package.json');
const packageJson = require('package-json');
const SAFE_TIME = 1000 * 1 * 60 * 60 * 24 * 7; //7days
//@xkeshi/vue-qrcode no longer maintained, forked out to mew
// higher versions for copy-webpack-plugin require webpack 5
const EXCEPTIONS = [
  '@xkeshi/vue-qrcode',
  'multicoin-address-validator',
  'postcss-import',
  'postcss-url',
  'copy-webpack-plugin'
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
