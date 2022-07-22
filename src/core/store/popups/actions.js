const setTrackingConsent = function ({ commit, dispatch }, val) {
  commit('SET_TRACKING_CONSENT', val);
  dispatch('setTracking');
};

const neverShowEnkryptPromo = function ({ commit }) {
  commit('NEVER_SHOW_ENKRYPT_PROMO');
};

const setTracking = function ({ state }) {
  const matomoExists = () => {
    return new Promise(resolve => {
      const checkInterval = 50;
      const timeout = 5000;
      const waitStart = Date.now();
      const interval = setInterval(() => {
        if (this._vm.$matomo) {
          clearInterval(interval);
          return resolve();
        }
        if (Date.now() >= waitStart + timeout) {
          clearInterval(interval);
        }
      }, checkInterval);
    });
  };
  matomoExists().then(() => {
    if (state.consentToTrack) this._vm.$matomo.setConsentGiven();
    else this._vm.$matomo.forgetConsentGiven();
  });
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
export default {
  setTrackingConsent,
  setTracking,
  neverShowEnkryptPromo,
  neverShowEnkryptLandingPage,
  neverShowEnkryptWalletPage,
  showEnkryptWalletSnackbar,
  closeEnkryptWalletSnackbar
};
