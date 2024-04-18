import localStore from 'store';
import Configs from '../configs';

const initStore = function () {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.popups)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.popups);
    if (savedStore.stateVersion === Configs.VERSION.popups) {
      this.$state = Object.assign(this.$state, savedStore);
    }
  }
};

const setTrackingConsent = function (val) {
  this.consentToTrack = val;
};

const neverShowEnkryptLandingPage = function () {
  this.displayedTrackingPopup = true;
};

const neverShowEnkryptWalletPage = function () {
  this.showedBanner = true;
};

const showEnkryptWalletSnackbar = function () {
  this.enkryptWalletPopup = false;
  this.enkryptWalletPopupClosed = new Date().getTime();
};

const closeEnkryptWalletSnackbar = function () {
  this.enkryptWalletSnackbar = true;
  this.enkryptWalletSnackbarCounter += 1;
};

const setPkSurvey = function () {
  this.enkryptWalletSnackbar = false;
  this.enkryptWalletSnackbarClosed = new Date().getTime();
};

const shownPkSurveyCounter = function () {
  this.pkSurveyShown = true;
};

const setShownEu = function () {
  this.shownChoiceEU = true;
};

export default {
  setTrackingConsent,
  neverShowEnkryptLandingPage,
  neverShowEnkryptWalletPage,
  showEnkryptWalletSnackbar,
  closeEnkryptWalletSnackbar,
  setPkSurvey,
  shownPkSurveyCounter,
  setShownEu,
  initStore
};
