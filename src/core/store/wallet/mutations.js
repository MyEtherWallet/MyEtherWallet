const SET_BLOCK_NUMBER = function (state, blockNumber) {
  state.blockNumber = blockNumber;
};

const REMOVE_WALLET = function (state) {
  state.instance = null;
  state.balance = 0;
  state.address = null;
  state.isHardware = false;
  state.identifier = '';
};

const SET_WALLET = function (state, wallet) {
  state.instance = wallet;
  state.address = wallet.getAddressString();
  state.isHardware = wallet.hasOwnProperty('isHardware')
    ? wallet.isHardware
    : false;
  state.identifier = wallet.identifier;
  if (!wallet.hasOwnProperty('isHardware')) {
    state.nickname = wallet.getNickname();
  }
};

const SET_BALANCE = function (state, balance) {
  state.balance = balance;
};

const SET_ENS = function (state, ens) {
  state.ens = ens;
};

const SET_WEB3_INSTANCE = function (state, web3) {
  state.web3 = web3;
};

const SET_OWNED_DOMAINS = function (state, ensDomains) {
  state.ensDomains = ensDomains;
};

const SET_TOKENS = function (state, tokens) {
  state.tokens = tokens;
};

const SET_LOADING_WALLET_INFO = function (state, isLoading) {
  state.loadingWalletInfo = isLoading;
};

export default {
  REMOVE_WALLET,
  SET_WALLET,
  SET_BALANCE,
  SET_ENS,
  SET_WEB3_INSTANCE,
  SET_BLOCK_NUMBER,
  SET_OWNED_DOMAINS,
  SET_TOKENS,
  SET_LOADING_WALLET_INFO
};
