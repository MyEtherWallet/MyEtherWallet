const setOnlineStatus = function ({ commit, dispatch }, val) {
  if (val) dispatch('wallet/setWeb3Instance', null, { root: true });
  commit('SET_ONLINE_STATUS', val);
};

const setLocale = function ({ commit }, val) {
  commit('SET_LOCALE', val);
};

const setLastPath = function ({ commit }, val) {
  commit('SET_LAST_PATH', val);
};

export default {
  setOnlineStatus,
  setLocale,
  setLastPath
};
