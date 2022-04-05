import localStore from 'store';
import Configs from './configs';

const INIT_STORE = function (state) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.ensManagerStore)) {
    const savedStore = localStore.get(
      Configs.LOCAL_STORAGE_KEYS.ensManagerStore
    );
    if (savedStore.stateVersion === Configs.VERSION.ensManagerStore) {
      Object.assign(state, savedStore);
    }
  }
};

const SET_SHOW_HAS_CLAIMABLE = function (state, val) {
  state.showHasClaimable = val;
};

export default {
  INIT_STORE,
  SET_SHOW_HAS_CLAIMABLE
};
