const SET_URL_QUERY = (state, newQuery) => {
  state.queryVal = newQuery;
};

const LAST_PATH = (state, lastPath) => {
  state.lastPath = lastPath;
};

const DECRYPT_WALLET = function (state, wallet) {
  state.wallet = wallet;
  state.account['address'] = wallet.getAddressString();
  state.account['isHardware'] = wallet.isHardware;
  state.account['identifier'] = wallet.identifier;
  if (!wallet.hasOwnProperty('isHardWare')) {
    state.account['nickname'] = wallet.getNickname();
    state.account['keystore'] = wallet.getKeystore();
  }
};

export default {
  SET_URL_QUERY,
  LAST_PATH,
  DECRYPT_WALLET
};
