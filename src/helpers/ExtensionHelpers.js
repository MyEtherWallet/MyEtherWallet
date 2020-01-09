import Toast from './responseHandler';
import { toChecksumAddress, isAddress } from './addressUtils';
import { MnemonicWallet } from '@/wallets';
import Misc from './misc';

const getAccounts = callback => {
  const chrome = window.chrome;
  chrome.storage.sync.get(null, callback);
};

const getPrivFromMnemonicWallet = async (mnem, path) => {
  const wallet = await MnemonicWallet(mnem, '');
  return wallet.hdKey.derive(path ? path : wallet.basePath).privateKey;
};

const addWalletToStore = (
  address,
  encStr,
  nickname,
  type,
  addType,
  callback
) => {
  const checksummedAddr = toChecksumAddress(address).toLowerCase();
  const chrome = window.chrome;

  getAccounts(item => {
    const foundAddress = Object.keys(item).find(key => {
      if (isAddress(key)) {
        return (
          toChecksumAddress(key).toLocaleLowerCase() ===
          checksummedAddr.toLocaleLowerCase()
        );
      }
    });
    const foundNickname = Object.keys(item).find(key => {
      if (isAddress(key)) {
        return JSON.parse(item[key]).nick === nickname;
      }
    });

    if (addType === 'edit') {
      if (foundNickname) {
        Toast.responseHandler('mewcx.nickname-found', Toast.WARN);
        return;
      }
    } else {
      if (foundAddress) {
        Toast.responseHandler('mewcx.address-already-stored', Toast.ERROR);
        return;
      }
    }
    nickname = Misc.stripTags(nickname.replace(/(<([^>]+)>)/gi, ''));
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
      Toast.responseHandler(this.$t('mewcx.something-went-wrong'), Toast.ERROR);
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
    Toast.responseHandler(this.$t('mewcx.something-went-wrong'), Toast.ERROR);
  }
};

export default {
  getAccounts,
  addWalletToStore,
  getPrivFromMnemonicWallet,
  deleteWalletFromStore
};
