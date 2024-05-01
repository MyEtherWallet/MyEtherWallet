import localStore from 'store';
import Configs from '../configs';

const initStore = () => {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.popups)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.popups);
    if (savedStore.stateVersion === Configs.VERSION.popups) {
      this.$state = Object.assign(this.$state, savedStore);
    }
  }
};

const setTrackingConsent = val => {
  this.consentToTrack = val;
};

const neverShowEnkryptLandingPage = () => {
  this.displayedTrackingPopup = true;
};

const neverShowEnkryptWalletPage = () => {
  this.showedBanner = true;
};

const showEnkryptWalletSnackbar = () => {
  this.enkryptWalletPopup = false;
  this.enkryptWalletPopupClosed = new Date().getTime();
};

const closeEnkryptWalletSnackbar = () => {
  this.enkryptWalletSnackbar = true;
  this.enkryptWalletSnackbarCounter += 1;
};

const setPkSurvey = () => {
  this.enkryptWalletSnackbar = false;
  this.enkryptWalletSnackbarClosed = new Date().getTime();
};

const shownPkSurveyCounter = () => {
  this.pkSurveyShown = true;
};

const setShownEu = () => {
  this.shownChoiceEU = true;
};

const neverShowBanner = () => {
  this.showedBanner = true;
};

const neverShowPopup = () => {
  this.displayedTrackingPopup = false;
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
  initStore,
  neverShowBanner,
  neverShowPopup
};
