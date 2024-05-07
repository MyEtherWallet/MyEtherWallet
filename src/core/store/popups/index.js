import localStore from 'store';
import Configs from '../configs';
import { defineStore } from 'pinia';

const popupModule = {
  state: () => ({
    localStore: true,
    stateVersion: '1.0.2',
    consentToTrack: true,
    displayedTrackingPopup: true,
    showedBanner: true,
    enkryptWalletPopup: false,
    enkryptWalletPopupClosed: 0,
    enkryptWalletSnackbar: false,
    enkryptWalletSnackbarClosed: 0,
    enkryptWalletSnackbarCounter: 0,
    pkSurveyShown: false,
    pkSurveyShownCounter: 0,
    shownChoiceEU: false
  }),
  actions: {
    initStore() {
      if (localStore.get(Configs.LOCAL_STORAGE_KEYS.popups)) {
        const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.popups);
        if (savedStore.stateVersion === Configs.VERSION.popups) {
          this.$patch(Object.assign(this.$state, savedStore));
        }
      }
    },
    setTrackingConsent(val) {
      this.consentToTrack = val;
    },
    neverShowEnkryptLandingPage() {
      this.displayedTrackingPopup = true;
    },
    neverShowEnkryptWalletPage() {
      this.showedBanner = true;
    },
    showEnkryptWalletSnackbar() {
      this.enkryptWalletPopup = false;
      this.enkryptWalletPopupClosed = new Date().getTime();
    },
    closeEnkryptWalletSnackbar() {
      this.enkryptWalletSnackbar = true;
      this.enkryptWalletSnackbarCounter += 1;
    },
    setPkSurvey() {
      this.enkryptWalletSnackbar = false;
      this.enkryptWalletSnackbarClosed = new Date().getTime();
    },
    shownPkSurveyCounter() {
      this.pkSurveyShown = true;
    },
    setShownEu() {
      this.shownChoiceEU = true;
    },
    neverShowBanner() {
      this.showedBanner = true;
    },
    neverShowPopup() {
      this.displayedTrackingPopup = false;
    }
  }
};

export const usePopupStore = defineStore('popups', popupModule);
