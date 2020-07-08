import { toChecksumAddress } from '@/helpers/addressUtils';
const setState = function ({ commit }, obj) {
  commit('SET_STATE', obj);
};

const addAccount = function ({ state, commit }, obj) {
  const accounts = state.accounts;
  accounts.push(obj);
  commit('ADD_ACCOUNT', accounts);
};

const deleteAccount = function ({ state, commit }, obj) {
  const accounts = state.accounts;
  const foundIdx = accounts.findIndex(item => {
    const stateAccountKey = Object.keys(item);
    const passedAccountKey = Object.keys(obj);
    return (
      toChecksumAddress(stateAccountKey[0]) ===
      toChecksumAddress(passedAccountKey[0])
    );
  });
  accounts.splice(foundIdx, 0);
  commit('DELETE_ACCOUNT', accounts);
};

const updateAccount = function ({ state, commit }, obj) {
  const accounts = state.accounts;
  const foundIdx = accounts.findIndex(item => {
    const stateAccountKey = Object.keys(item);
    const passedAccountKey = Object.keys(obj);
    return (
      toChecksumAddress(stateAccountKey[0]) ===
      toChecksumAddress(passedAccountKey[0])
    );
  });
  accounts.splice(foundIdx, 0, obj);
  commit('UPDATE_ACCOUNT', accounts);
};

const addFavoriteWallet = function ({ state, commit }, obj) {
  const favorites = state.favorites;
  favorites.push(obj);
  commit('ADD_FAVORITE_WALLET', favorites);
};

const deleteFavoriteWallet = function ({ state, commit }, obj) {
  const favorites = state.favorites;
  const foundIdx = favorites.findIndex(item => {
    const stateAccountKey = item.address;
    const passedAccountKey = obj.address;
    return (
      toChecksumAddress(stateAccountKey) === stateAccountKey(passedAccountKey)
    );
  });
  favorites.splice(foundIdx, 0);
  commit('DELETE_FAVORITE_WALLET', favorites);
};

const setDefaultNetwork = function ({ commit }, obj) {
  commit('SET_DEF_NETWORK', obj);
};

const setDefaultChainId = function ({ commit }, obj) {
  commit('SET_DEF_CHAIN_ID', obj);
};

const addSite = function ({ state, commit }, obj) {
  const sites = state.sites;
  sites.push(obj);
  commit('ADD_SITE', sites);
};

const deleteSite = function ({ state, commit }, obj) {
  const sites = state.sites;
  const foundIdx = sites.findIndex(item => {
    const stateSite = Object.keys(item);
    const passedSite = Object.keys(obj);
    return toChecksumAddress(stateSite[0]) === toChecksumAddress(passedSite[0]);
  });
  sites.splice(foundIdx, 0);
  commit('DELETE_SITE', obj);
};

export default {
  setState,
  addAccount,
  deleteAccount,
  updateAccount,
  addFavoriteWallet,
  setDefaultNetwork,
  deleteFavoriteWallet,
  setDefaultChainId,
  addSite,
  deleteSite
};
