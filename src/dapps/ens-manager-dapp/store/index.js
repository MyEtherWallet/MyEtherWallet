import { ref } from 'vue';
import { defineStore } from 'pinia';
import store from 'store';

import Configs from './configs';

export const useEnsManagerStore = defineStore('ensManagerStore', () => {
  const localStore = ref(true);
  const showHasClaimable = ref(true);
  const stateVersion = ref(Configs.VERSION.ensManagerStore);

  // actions
  const initStore = () => {
    if (store.get(Configs.LOCAL_STORAGE_KEYS.coinbaseStaking)) {
      const savedStore = store.get(Configs.LOCAL_STORAGE_KEYS.coinbaseStaking);
      if (savedStore.stateVersion === Configs.VERSION.coinbaseStaking) {
        $patch(Object.assign($state, savedStore));
      }
    }
  };

  const setShowHasClaimable = val => {
    showHasClaimable.value = val;
  };

  return {
    localStore,
    showHasClaimable,
    stateVersion,
    initStore,
    setShowHasClaimable
  };
});
