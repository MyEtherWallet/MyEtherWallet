const bip39 = require('bip39');

function phrase12() {
  return bip39.generateMnemonic(128).split(' ');
}

function phrase24() {
  return bip39.generateMnemonic(256).split(' ');
}

export default {
  phrase12,
  phrase24
};
