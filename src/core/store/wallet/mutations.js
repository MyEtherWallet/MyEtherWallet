const SET_BLOCK_NUMBER = function (state, blockNumber) {
  state.blockNumber = blockNumber;
};

const REMOVE_WALLET = function (state) {
  state.instance = null;
  this.balance = 0;
  this.address = null;
  this.isHardWare = null;
  this.identifier = '';
  state.initialLoadTokens = true;
  state.initialLoadBalance = true;
};

const SET_WALLET = function (state, wallet) {
  state.instance = wallet;
  state.address = wallet.getAddressString();
  state.isHardware = wallet.isHardware;
  state.identifier = wallet.identifier;
  if (!wallet.hasOwnProperty('isHardWare')) {
    state.nickname = wallet.getNickname();
  }
};

const SET_BALANCE = function (state, balance) {
  state.balance = balance;
  if (state.initialLoadBalance) {
    state.initialLoadBalance = false
  }
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
  if (state.initialLoadTokens) {
    state.initialLoadTokens = false
  }
};


export default {
  REMOVE_WALLET,
  SET_WALLET,
  SET_BALANCE,
  SET_ENS,
  SET_WEB3_INSTANCE,
  SET_BLOCK_NUMBER,
  SET_OWNED_DOMAINS,
  SET_TOKENS
};
