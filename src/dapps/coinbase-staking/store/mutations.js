import localStore from 'store';
import Configs from './configs';

const INIT_STORE = function (state) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.coinbaseStaking)) {
    const savedStore = localStore.get(
      Configs.LOCAL_STORAGE_KEYS.coinbaseStaking
    );
    if (savedStore.stateVersion === Configs.VERSION.coinbaseStaking) {
      Object.assign(state, savedStore);
    }
  }
};

const STORE_FETCHED = function (state, obj) {
  const date = new Date();
  const copy = Object.assign(state.fetchedDetails);
  const lastFetchedCopy = Object.assign(state.lastFetched);
  lastFetchedCopy[obj[1]] = date.getTime();
  copy[obj[1]] = obj[0];
  state.fetchedDetails = copy;
  state.lastFetched = lastFetchedCopy;
};

export default {
  INIT_STORE,
  STORE_FETCHED
};
