import { defineStore } from 'pinia';
import localStore from 'store';

import Configs from './configs';
import { useGlobalStore } from '@/core/store/global';

const ethBlocksTxs = {
  state: () => ({
    localStore: true,
    ethBlocksTxs: [],
    stateVersion: Configs.VERSION.ethBlocksTxs,
    cart: {
      ETH: []
    }
  }),
  actions: {
    initStore() {
      if (localStore.get(Configs.LOCAL_STORAGE_KEYS.ethBlocksTxs)) {
        const savedStore = localStore.get(
          Configs.LOCAL_STORAGE_KEYS.ethBlocksTxs
        );
        if (savedStore.stateVersion === Configs.VERSION.ethBlocksTxs) {
          this.$patch(Object.assign(this.$state, savedStore));
        }
      }
    },

    /**
     * Adds blockNumber with a transaction
     * @param {Object} val - {blockNumber: '123', network: 'ETH', hash: '0x...'}
     */
    addEthBlockTx(val) {
      if (this.ethBlocksTxs.length >= 100) {
        this.ethBlocksTxs.shift();
      }
      this.ethBlocksTxs.push(val);
    },
    /**
     * Deletes blockNumber with a transaction from the eth Blocks
     * @param {Object} val - block number
     */
    deleteEthBlockTx(val) {
      const idx = this.ethBlocksTxs.findIndex(item => {
        if (item.hash === val.hash) {
          return item;
        }
      });
      if (idx >= 0) {
        this.ethBlocksTxs.splice(idx, 1);
      }
    },

    /**
     * Adds blockNumber to cart (ETH)
     * @param {string} val
     */
    addBlockToCart(val) {
      if (this.cart.ETH.length >= 100) {
        this.cart.ETH.shift();
      }
      this.cart.ETH.push(val);
    },

    /**
     * remove blockNumber to cart (ETH)
     * @param {string} val
     */
    removeBlockFromCart(val) {
      this.cart.ETH = this.cart.ETH.filter(item => {
        if (item !== val) return item;
      });
    },

    /**
     * empty cart
     * @param {string} val
     */
    emptyCart() {
      this.cart.ETH = [];
    }
  },
  getters: {
    /**
     * Returns all transactions in the state
     * @returns {Array}
     */

    getAllEthBlocksTxs(state) {
      const { network } = useGlobalStore();
      const currentNetworkType = network.type.name;
      const filteredArray = state.ethBlocksTxs.filter(item => {
        if (item.network === currentNetworkType) return item;
      });
      return state.ethBlocksTxs.length > 0 ? filteredArray : [];
    },

    /**
     * Returns all transactions in the state
     * @param {Object} block - {blockNumber: '1234', hash: '0x...', network: 'Eth' }
     * @returns {Object} --> {blockNumber: '1234', hash: '0x...', network: 'Eth' }
     */
    getEthBlockTx(state) {
      return block => {
        const filteredArray = state.ethBlocksTxs.filter(item => {
          if (
            block.blockNumber === item.blockNumber &&
            item.network === block.network
          ) {
            return item;
          }
        });
        return filteredArray.length > 0 ? filteredArray[0] : null;
      };
    }
  }
};

export const useEthBlocksTxsStore = defineStore('ethBlocksTxs', ethBlocksTxs);
