import localStore from 'store';
import Configs from './configs';

const INIT_STORE = function (state) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.ethBlocksTxs)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.ethBlocksTxs);
    if (savedStore.stateVersion === Configs.VERSION.ethBlocksTxs) {
      Object.assign(state, savedStore);
    }
  }
};

export default {
  INIT_STORE
};
