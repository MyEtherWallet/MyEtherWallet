import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import store from 'store';

import Configs from './configs';
import { useGlobalStore } from '@/core/store/global';

export const useEthBlocksTxsStore = defineStore('ethBlocksTxs', () => {
  const localStore = ref(true);
  const ethBlocksTxs = ref([]);
  const stateVersion = ref(Configs.VERSION.ethBlocksTxs);
  const cart = ref({
    ETH: []
  });

  // actions
  const initStore = () => {
    if (store.get(Configs.LOCAL_STORAGE_KEYS.ethBlocksTxs)) {
      const savedStore = store.get(Configs.LOCAL_STORAGE_KEYS.ethBlocksTxs);
      if (savedStore.stateVersion === Configs.VERSION.ethBlocksTxs) {
        $patch(Object.assign($state, savedStore));
      }
    }
  };

  const addEthBlockTx = val => {
    if (ethBlocksTxs.value.length >= 100) {
      ethBlocksTxs.value.shift();
    }
    ethBlocksTxs.value.push(val);
  };

  const deleteEthBlockTx = val => {
    const idx = ethBlocksTxs.value.findIndex(item => {
      if (item.hash === val.hash) {
        return item;
      }
    });
    if (idx >= 0) {
      ethBlocksTxs.value.splice(idx, 1);
    }
  };

  const addBlockToCart = val => {
    if (cart.value.ETH.length >= 100) {
      cart.value.ETH.shift();
    }
    cart.value.ETH.push(val);
  };

  const removeBlockFromCart = val => {
    cart.value.ETH = cart.value.ETH.filter(item => {
      if (item !== val) return item;
    });
  };

  const emptyCart = () => {
    cart.value.ETH = [];
  };

  // getters
  const getAllEthBlocksTxs = computed(() => {
    const { network } = useGlobalStore();
    const currentNetworkType = network.value.type.name;
    const filteredArray = ethBlocksTxs.value.filter(item => {
      if (item.network === currentNetworkType) return item;
    });
    return ethBlocksTxs.value.length > 0 ? filteredArray : [];
  });

  const getEthBlockTx = () => {
    return block => {
      const filteredArray = ethBlocksTxs.value.filter(item => {
        if (
          block.blockNumber === item.blockNumber &&
          item.network === block.network
        ) {
          return item;
        }
      });
      return filteredArray.length > 0 ? filteredArray[0] : null;
    };
  };

  return {
    localStore,
    ethBlocksTxs,
    stateVersion,
    cart,
    initStore,
    addEthBlockTx,
    deleteEthBlockTx,
    addBlockToCart,
    removeBlockFromCart,
    emptyCart,
    getAllEthBlocksTxs,
    getEthBlockTx
  };
});
