import { defineStore } from 'pinia';
import localStore from 'store';

import Configs from './configs';

const ensManagerStore = {
  state: () => ({
    localStore: true,
    showHasClaimable: true,
    stateVersion: Configs.VERSION.ensManagerStore
  }),
  actions: {
    initStore() {
      if (localStore.get(Configs.LOCAL_STORAGE_KEYS.coinbaseStaking)) {
        const savedStore = localStore.get(
          Configs.LOCAL_STORAGE_KEYS.coinbaseStaking
        );
        if (savedStore.stateVersion === Configs.VERSION.coinbaseStaking) {
          this.$patch(Object.assign(this.$state, savedStore));
        }
      }
    },
    setShowHasClaimable(val) {
      this.showHasClaimable = val;
    }
  }
};

export const useEnsManagerStore = defineStore(
  'ensManagerStore',
  ensManagerStore
);
