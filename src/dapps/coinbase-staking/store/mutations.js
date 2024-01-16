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

const STORE_FETCHED = function (state, obj) {
  const date = new Date();
  state.fetchedDetails = obj;
  state.lastFetched = date.toUTCString();
};

export default {
  INIT_STORE,
  STORE_FETCHED
};
