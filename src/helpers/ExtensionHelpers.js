const bip39 = require('bip39');
import * as HDKey from 'hdkey';
import Toast from './responseHandler';
import { toChecksumAddress } from './addressUtils';

const getAccounts = callback => {
  const chrome = window.chrome;
  chrome.storage.sync.get(null, callback);
};

const getPrivFromMnemonicWallet = (mnemonic, path) => {
  const hdKey = HDKey.fromMasterSeed(bip39.mnemonicToSeedSync(mnemonic, ''));
  return hdKey.derive(path)._privateKey;
};

const addWalletToStore = (address, encStr, nickname, type, callback) => {
  const checksummedAddr = toChecksumAddress(address).toLowerCase();
  const chrome = window.chrome;
  nickname = nickname.replace(/(<([^>]+)>)/gi, '');
  const value = {
    nick: nickname,
    priv: encStr,
    type: type
  };
  if (!encStr) delete value['priv'];
  const obj = {};
  obj[checksummedAddr] = JSON.stringify(value);
  try {
    chrome.storage.sync.set(obj, callback);
  } catch (e) {
    Toast.responseHandler('Something went wrong!', Toast.ERROR);
  }
};

const deleteWalletFromStore = (addr, callback) => {
  const chrome = window.chrome;
  try {
    chrome.storage.sync.remove(toChecksumAddress(addr).toLowerCase(), callback);
  } catch (e) {
    Toast.responseHandler('Something went wrong!', Toast.ERROR);
  }
};

export default {
  getAccounts,
  addWalletToStore,
  getPrivFromMnemonicWallet,
  deleteWalletFromStore
};
