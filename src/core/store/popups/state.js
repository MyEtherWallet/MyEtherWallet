import Configs from '../configs';

const state = {
  localStore: true,
  stateVersion: Configs.VERSION.popups,
  consentToTrack: true,
  displayedTrackingPopup: true,
  showedBanner: true,
  enkryptWalletPopup: false,
  enkryptWalletPopupClosed: 0,
  enkryptWalletSnackbar: false,
  enkryptWalletSnackbarClosed: 0,
  enkryptWalletSnackbarCounter: 0,
  pkSurveyShown: false,
  shownChoiceEU: false
};

export default state;
