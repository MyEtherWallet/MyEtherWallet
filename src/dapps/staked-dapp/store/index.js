import { ref } from 'vue';
import { defineStore } from 'pinia';
import store from 'store';
import Configs from './configs';

export const useStakedStore = defineStore('stakedStore', () => {
  const localStore = ref(true);
  const stateVersion = ref(Configs.VERSION.stakedStore);
  const validatorIndex = ref([]);
  const withdrawalValidatorIndex = ref([]);

  // actions
  const initStore = () => {
    if (store.get(Configs.LOCAL_STORAGE_KEYS.stakedStore)) {
      const savedStore = store.get(Configs.LOCAL_STORAGE_KEYS.stakedStore);
      if (savedStore.stateVersion === Configs.VERSION.stakedStore) {
        $patch(Object.assign($state, savedStore));
      }
    }
  };

  const addValidatorIndex = validatorId => {
    const newArray = validatorIndex.value.slice(); // no ref copy
    const found = newArray.find(item => item === validatorId);
    if (!found) {
      newArray.push(validatorId);
    }
    validatorIndex.value = newArray;
  };
  const addWithdrawalValidatorIndex = validatorId => {
    const newArray = withdrawalValidatorIndex.value.slice(); // no ref copy
    const found = newArray.find(item => item === validatorId);
    if (!found) {
      newArray.push(validatorId);
    }
    withdrawalValidatorIndex.value = newArray;
  };

  return {
    localStore,
    stateVersion,
    validatorIndex,
    withdrawalValidatorIndex,
    initStore,
    addValidatorIndex,
    addWithdrawalValidatorIndex
  };
});
