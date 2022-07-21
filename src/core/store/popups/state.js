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
  enkryptLandingPopupClosed: 0
};

export default state;
