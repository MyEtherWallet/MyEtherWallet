import localStore from 'store';
import Configs from './configs';

const initStore = function () {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.coinbaseStaking)) {
    const savedStore = localStore.get(
      Configs.LOCAL_STORAGE_KEYS.coinbaseStaking
    );
    if (savedStore.stateVersion === Configs.VERSION.coinbaseStaking) {
      this.$patch(Object.assign(this.$state, savedStore));
    }
  }
};

const setShowHasClaimable = function (val) {
  this.showHasClaimable = val;
};

export default {
  initStore,
  setShowHasClaimable
};
