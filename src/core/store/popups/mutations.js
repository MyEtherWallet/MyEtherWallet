import localStore from 'store';
import Configs from '../configs';

const INIT_STORE = function (state) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.popups)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.popups);
    if (savedStore.stateVersion === Configs.VERSION.popups) {
      Object.assign(state, savedStore);
    }
  }
};
const SET_TRACKING_CONSENT = function (state, val) {
  state.consentToTrack = val;
};

const NEVER_SHOW_TRACKING = function (state) {
  state.displayedTrackingPopup = true;
};

const NEVER_SHOW_BANNER = function (state) {
  state.showedBanner = true;
};

const NEVER_SHOW_WALLET_ENKRYPT_POPUP = function (state) {
  state.enkryptWalletPopup = false;
  state.enkryptWalletPopupClosed = new Date().getTime();
};

const SHOW_WALLET_ENKRYPT_SNACKBAR = function (state) {
  state.enkryptWalletSnackbar = true;
  state.enkryptWalletSnackbarCounter += 1;
};

const CLOSE_WALLET_ENKRYPT_SNACKBAR = function (state) {
  state.enkryptWalletSnackbar = false;
  state.enkryptWalletSnackbarClosed = new Date().getTime();
};

const SET_PK_SURVEY = function (state) {
  state.pkSurvey = true;
};

export default {
  INIT_STORE,
  SET_TRACKING_CONSENT,
  NEVER_SHOW_TRACKING,
  NEVER_SHOW_BANNER,
  NEVER_SHOW_WALLET_ENKRYPT_POPUP,
  SHOW_WALLET_ENKRYPT_SNACKBAR,
  CLOSE_WALLET_ENKRYPT_SNACKBAR,
  SET_PK_SURVEY
};
