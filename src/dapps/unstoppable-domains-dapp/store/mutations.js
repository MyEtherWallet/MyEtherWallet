const EMPTY_DOMAIN = {
  name: '',
  available: false,
  price: 0
};

const CLEAR_DOMAIN = state => (state.currentDomain = EMPTY_DOMAIN);
const SET_CURRENT_DOMAIN = (state, payload) =>
  (state.currentDomain = payload.value);
const SET_MY_DOMAIN = (state, payload) => (state.myDomains = payload.value);
const SET_MANAGE_RECORD = (state, payload) =>
  (state.manageRecordDomain = payload.value);
const SET_ACTIVE_OVERLAY = (state, payload) =>
  (state.activeOverlay = payload.value);
const SET_ORDER = (state, payload) => (state.order = payload.value);

export default {
  CLEAR_DOMAIN,
  SET_CURRENT_DOMAIN,
  SET_MY_DOMAIN,
  SET_MANAGE_RECORD,
  SET_ACTIVE_OVERLAY,
  SET_ORDER
};
