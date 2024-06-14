import { ref } from 'vue';
import store from 'store';
import Configs from '../configs';
import { defineStore } from 'pinia';

export const usePopupStore = defineStore('popups', () => {
  // data
  const localStore = true;
  const stateVersion = '1.0.2';
  const consentToTrack = ref(true);
  const displayedTrackingPopup = ref(true);
  const showedBanner = ref(true);
  const enkryptWalletPopup = ref(false);
  const enkryptWalletPopupClosed = ref(0);
  const enkryptWalletSnackbar = ref(false);
  const enkryptWalletSnackbarClosed = ref(0);
  const enkryptWalletSnackbarCounter = ref(0);
  const pkSurveyShown = ref(false);
  const pkSurveyShownCounter = ref(0);
  const shownChoiceEU = ref(false);

  // action
  const initStore = () => {
    if (store.get(Configs.LOCAL_STORAGE_KEYS.popups)) {
      const savedStore = store.get(Configs.LOCAL_STORAGE_KEYS.popups);
      if (savedStore.stateVersion === Configs.VERSION.popups) {
        $patch(Object.assign($state, savedStore));
      }
    }
  };
  const setTrackingConsent = val => {
    consentToTrack.value = val;
  };
  const neverShowEnkryptLandingPage = () => {
    displayedTrackingPopup.value = true;
  };
  const neverShowEnkryptWalletPage = () => {
    showedBanner.value = true;
  };
  const showEnkryptWalletSnackbar = () => {
    enkryptWalletPopup.value = false;
    enkryptWalletPopupClosed.value = new Date().getTime();
  };
  const closeEnkryptWalletSnackbar = () => {
    enkryptWalletSnackbar.value = true;
    enkryptWalletSnackbarCounter.value += 1;
  };
  const setPkSurvey = () => {
    enkryptWalletSnackbar.value = false;
    enkryptWalletSnackbarClosed.value = new Date().getTime();
  };
  const shownPkSurveyCounter = () => {
    pkSurveyShown.value = true;
  };
  const setShownEu = () => {
    shownChoiceEU.value = true;
  };
  const neverShowBanner = () => {
    showedBanner.value = true;
  };
  const neverShowPopup = () => {
    displayedTrackingPopup.value = false;
  };

  return {
    localStore,
    stateVersion,
    consentToTrack,
    displayedTrackingPopup,
    showedBanner,
    enkryptWalletPopup,
    enkryptWalletPopupClosed,
    enkryptWalletSnackbar,
    enkryptWalletSnackbarClosed,
    enkryptWalletSnackbarCounter,
    pkSurveyShown,
    pkSurveyShownCounter,
    shownChoiceEU,
    initStore,
    setTrackingConsent,
    neverShowEnkryptLandingPage,
    neverShowEnkryptWalletPage,
    showEnkryptWalletSnackbar,
    closeEnkryptWalletSnackbar,
    setPkSurvey,
    shownPkSurveyCounter,
    setShownEu,
    neverShowBanner,
    neverShowPopup
  };
});
