import localStore from 'store';
import Configs from '../configs';

const INIT_STORE = function (state) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.custom)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.custom);
    if (savedStore.stateVersion === Configs.VERSION.custom) {
      Object.assign(state, savedStore);
    }
  }
};
const SET_CUSTOM_TOKEN = function (state, token) {
  state.customTokens.push(token);
};
export default {
  SET_CUSTOM_TOKEN,
  INIT_STORE
};
