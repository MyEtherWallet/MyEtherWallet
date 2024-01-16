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

export default {
  INIT_STORE
};
