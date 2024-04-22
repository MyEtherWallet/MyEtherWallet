import localStore from 'store';
import Configs from './configs';

const initStore = function () {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.coinbaseStaking)) {
    const savedStore = localStore.get(
      Configs.LOCAL_STORAGE_KEYS.coinbaseStaking
    );
    if (savedStore.stateVersion === Configs.VERSION.coinbaseStaking) {
      this.$state = Object.assign(this.$state, savedStore);
    }
  }
};

const storeFetched = function (obj) {
  const date = new Date();
  const copy = Object.assign(this.fetchedDetails);
  const lastFetchedCopy = Object.assign(this.lastFetched);
  lastFetchedCopy[obj[1]] = date.getTime();
  copy[obj[1]] = obj[0];
  this.fetchedDetails = copy;
  this.lastFetched = lastFetchedCopy;
};
export default {
  storeFetched,
  initStore
};
