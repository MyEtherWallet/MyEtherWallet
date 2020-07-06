const chrome = window.chrome;

const SET_STATE = function (state, obj) {
  Object.keys(obj).forEach(item => {
    state[item] = obj[item];
  });
};

const ADD_ACCOUNT = function (state, accounts) {
  state.accounts = accounts;
  chrome.storage.sync.set(
    { accounts: JSON.stringify(accounts) },
    function () {}
  );
};
const DELETE_ACCOUNT = function (state, accounts) {
  state.accounts = accounts;
  chrome.storage.sync.set(
    { accounts: JSON.stringify(accounts) },
    function () {}
  );
};
const UPDATE_ACCOUNT = function (state, accounts) {
  state.accounts = accounts;
  chrome.storage.sync.set(
    { accounts: JSON.stringify(accounts) },
    function () {}
  );
};
const ADD_FAVORITE_WALLET = function (state, favorites) {
  state.favorites = favorites;
  chrome.storage.sync.set(
    { favorites: JSON.stringify(favorites) },
    function () {}
  );
};
const DELETE_FAVORITE_WALLET = function (state, favorites) {
  state.favorites = favorites;
  chrome.storage.sync.set(
    { favorites: JSON.stringify(favorites) },
    function () {}
  );
};
const SET_DEF_NETWORK = function (state, obj) {
  state.defNetwork = obj;
  chrome.storage.sync.set({ defNetwork: JSON.stringify(obj) }, function () {});
};
const SET_DEF_CHAIN_ID = function (state, num) {
  state.defChainID = num;
  chrome.storage.sync.set({ defChainID: num }, function () {});
};
const ADD_SITE = function (state, sites) {
  state.sites = sites;
  chrome.storage.sync.set({ sites: JSON.stringify(sites) }, function () {});
};
const DELETE_SITE = function (state, sites) {
  state.sites = sites;
  chrome.storage.sync.set({ sites: JSON.stringify(sites) }, function () {});
};
export default {
  SET_STATE,
  ADD_ACCOUNT,
  DELETE_ACCOUNT,
  UPDATE_ACCOUNT,
  ADD_FAVORITE_WALLET,
  DELETE_FAVORITE_WALLET,
  SET_DEF_NETWORK,
  SET_DEF_CHAIN_ID,
  ADD_SITE,
  DELETE_SITE
};
