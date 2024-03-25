const setTrackingConsent = function ({ commit }, val) {
  commit('SET_TRACKING_CONSENT', val);
};

const neverShowEnkryptLandingPage = function ({ commit }) {
  commit('NEVER_SHOW_LANDING_ENKRYPT_POPUP');
};

const neverShowEnkryptWalletPage = function ({ commit }) {
  commit('NEVER_SHOW_WALLET_ENKRYPT_POPUP');
};

const showEnkryptWalletSnackbar = function ({ commit }) {
  commit('SHOW_WALLET_ENKRYPT_SNACKBAR');
};

const closeEnkryptWalletSnackbar = function ({ commit }) {
  commit('CLOSE_WALLET_ENKRYPT_SNACKBAR');
};

const setPkSurvey = function ({ commit }) {
  commit('SET_PK_SURVEY');
};

const setShownEu = function ({ commit }) {
  commit('SET_SHOWN_EU');
};

export default {
  setTrackingConsent,
  neverShowEnkryptLandingPage,
  neverShowEnkryptWalletPage,
  showEnkryptWalletSnackbar,
  closeEnkryptWalletSnackbar,
  setPkSurvey,
  setShownEu
};
