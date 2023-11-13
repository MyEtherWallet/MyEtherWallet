const setTrackingConsent = function ({ commit }, val) {
  commit('SET_TRACKING_CONSENT', val);
};

const neverShowEnkryptPromo = function ({ commit }) {
  commit('NEVER_SHOW_ENKRYPT_PROMO');
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

const showSurveyPopup = function ({ commit }) {
  commit('SHOW_SURVEY_POPUP');
};

const neverShowSurveyPopup = function ({ commit }) {
  commit('NEVER_SHOW_SURVEY_POPUP');
};

const neverShowSurveyBanner = function ({ commit }) {
  commit('NEVER_SHOW_SURVEY_BANNER');
};

export default {
  setTrackingConsent,
  neverShowEnkryptPromo,
  neverShowEnkryptLandingPage,
  neverShowEnkryptWalletPage,
  showEnkryptWalletSnackbar,
  closeEnkryptWalletSnackbar,
  showSurveyPopup,
  neverShowSurveyPopup,
  neverShowSurveyBanner
};
