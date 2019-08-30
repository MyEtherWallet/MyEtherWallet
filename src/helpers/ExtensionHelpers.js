const bip39 = require('bip39');
import * as HDKey from 'hdkey';
import Toast from './responseHandler';
import { toChecksumAddress, isAddress } from './addressUtils';

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
  getAccounts(item => {
    const found = Object.keys(item).find(key => {
      if (isAddress(key)) {
        return toChecksumAddress(key) === checksummedAddr;
      }
    });
    if (found) {
      Toast.responseHandler('Address already stored!', Toast.ERROR);
      return;
    }
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
  });
};

const deleteWalletFromStore = (addr, callback) => {
  const chrome = window.chrome;
  getAccounts(item => {
    Object.keys(item).forEach(key => {
      if (
        isAddress(item[key]) &&
        toChecksumAddress(item[key]) === toChecksumAddress(addr)
      ) {
        chrome.storage.sync.remove(key, () => {});
      }
    });
  });
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
