import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useSwapStore = defineStore('swap', () => {
  const localStore = false;
  const prefetched = ref(false);
  const swapTokens = ref([]);

  // actions
  const setSwapTokens = tokens => {
    swapTokens.value = tokens;
    prefetched.value = true;
  };
  const resetPrefetch = () => {
    prefetched.value = false;
  };

  return {
    localStore,
    prefetched,
    swapTokens,
    setSwapTokens,
    resetPrefetch
  };
});
