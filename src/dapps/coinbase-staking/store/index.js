import localStore from 'store';
import { defineStore } from 'pinia';

import Configs from './configs';

const coinbaseStaking = {
  state: () => ({
    localStore: true,
    lastFetched: {
      GOERLI: 0,
      HOLESKY: 0,
      ETH: 0
    },
    fetchedDetails: {
      GOERLI: {},
      HOLESKY: {},
      ETH: {}
    },
    stateVersion: Configs.VERSION.coinbaseStaking
  }),
  actions: {
    initStore() {
      if (localStore.get(Configs.LOCAL_STORAGE_KEYS.coinbaseStaking)) {
        const savedStore = localStore.get(
          Configs.LOCAL_STORAGE_KEYS.coinbaseStaking
        );
        if (savedStore.stateVersion === Configs.VERSION.coinbaseStaking) {
          this.$state = Object.assign(this.$state, savedStore);
        }
      }
    },
    storeFetched(obj) {
      const date = new Date();
      const copy = Object.assign(this.fetchedDetails);
      const lastFetchedCopy = Object.assign(this.lastFetched);
      lastFetchedCopy[obj[1]] = date.getTime();
      copy[obj[1]] = obj[0];
      this.fetchedDetails = copy;
      this.lastFetched = lastFetchedCopy;
    }
  }
};

export const useCoinbaseStakingStore = defineStore(
  'coinbaseStaking',
  coinbaseStaking
);
