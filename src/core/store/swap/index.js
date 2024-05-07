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

export const useSwapStore = defineStore('swap', swap);
