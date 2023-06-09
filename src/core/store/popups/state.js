import Configs from '../configs';

const state = {
  localStore: true,
  stateVersion: Configs.VERSION.popups,
  consentToTrack: false,
  displayedTrackingPopup: false,
  showedBanner: false,
  showWalletPromo: true,
  showEnkryptPromo: true,
  promoOver: false,
  enkryptLandingPopup: true,
  enkryptLandingPopupClosed: 0,
  enkryptWalletPopup: true,
  enkryptWalletPopupClosed: 0,
  enkryptWalletSnackbar: false,
  enkryptWalletSnackbarClosed: 0,
  enkryptWalletSnackbarCounter: 0,
  surveyPopup: false,
  neverShowSurveyPopup: false,
  surveyPopupClosed: 0,
  neverShowSurveyBanner: false,
  surveyBannerClosed: 0
};

export default state;
