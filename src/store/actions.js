const saveQueryVal = ({ commit }, val) => {
  commit('SET_URL_QUERY', val);
};
const setLastPath = ({ commit }, val) => {
  commit('LAST_PATH', val);
};

// const decryptWallet = function ({ commit, dispatch }, params) {
const decryptWallet = function ({ commit }, params) {
  // if the wallet param (param[0]) is undefined or null then all the subsequent setup steps will also fail.
  // just explicitly stop it here.
  if (params[0] !== undefined && params[0] !== null) {
    commit('DECRYPT_WALLET', params[0]);
    // dispatch('setWeb3Instance', params[1]);s
  } else {
    // Could replace this (sentry gets triggered) with a toast, to handle more gracefully
    // Or some means of informing the user of an issue
    return Promise.reject(
      Error(
        'Received null or undefined wallet parameter. Please refresh the page and try again'
      )
    );
  }
};

export default { saveQueryVal, setLastPath, decryptWallet };
