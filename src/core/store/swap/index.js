import { ref } from 'vue';
import { defineStore } from 'pinia';

const swap = {
  state: () => ({
    localStore: false,
    prefetched: false,
    swapTokens: []
  }),
  actions: {
    setSwapTokens(tokens) {
      this.swapTokens = tokens;
      this.prefetched = true;
    },
    resetPrefetch() {
      this.prefetched = false;
    }
  }
};

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
