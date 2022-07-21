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
  if (this._vm.$matomo) {
    this._vm.$matomo.setConsentGiven();
    this._vm.$matomo.trackEvent('consent', val ? 'true' : 'false');
    if (!val) this._vm.$matomo.forgetConsentGiven();
  }
  state.consentToTrack = val;
};

const NEVER_SHOW_TRACKING = function (state) {
  state.displayedTrackingPopup = true;
};

export default {
  INIT_STORE,
  SET_TRACKING_CONSENT,
  NEVER_SHOW_TRACKING
};
