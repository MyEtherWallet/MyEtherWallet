import store from 'store';
import { ref } from 'vue';
import { defineStore } from 'pinia';

import Configs from './configs';

export const useCoinbaseStakingStore = defineStore('coinbaseStaking', () => {
  const localStore = ref(true);
  const lastFetched = ref({
    GOERLI: 0,
    HOLESKY: 0,
    ETH: 0
  });
  const fetchedDetails = ref({
    GOERLI: {},
    HOLESKY: {},
    ETH: {}
  });
  const stateVersion = ref(Configs.VERSION.coinbaseStaking);

  // actions
  const initStore = () => {
    if (store.get(Configs.LOCAL_STORAGE_KEYS.coinbaseStaking)) {
      const savedStore = store.get(Configs.LOCAL_STORAGE_KEYS.coinbaseStaking);
      if (savedStore.stateVersion === Configs.VERSION.coinbaseStaking) {
        $patch(Object.assign($state, savedStore));
      }
    }
  };

  const storeFetched = obj => {
    const date = new Date();
    const copy = Object.assign(fetchedDetails.value);
    const lastFetchedCopy = Object.assign(lastFetched.value);
    lastFetchedCopy[obj[1]] = date.getTime();
    copy[obj[1]] = obj[0];
    fetchedDetails.value = copy;
    lastFetched.value = lastFetchedCopy;
  };

  return {
    localStore,
    lastFetched,
    fetchedDetails,
    stateVersion,
    initStore,
    storeFetched
  };
});
