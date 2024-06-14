import { defineStore } from 'pinia';
import localStore from 'store';
import { fromWei } from 'web3-utils';
import BigNumber from 'bignumber.js';

import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { toBNSafe } from '@/core/helpers/numberFormatHelper';
import Configs from './configs';

const stakewise = {
  state: () => ({
    localStore: true,
    stakewiseTxs: { ETH: [], GOERLI: [] },
    validatorApr: '0',
    poolSupply: '0',
    stakingFee: '0',
    stateVersion: Configs.VERSION.stakewise,
    rethBalance: '0',
    sethBalance: '0'
  }),
  actions: {
    initStore() {
      if (localStore.get(Configs.LOCAL_STORAGE_KEYS.stakewise)) {
        const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.stakewise);
        if (savedStore.stateVersion === Configs.VERSION.stakewise) {
          this.$patch(Object.assign(this.$state, savedStore));
        }
      }
    },
    setPoolSupply(val) {
      this.poolSupply = val;
    },
    setStakingFee(val) {
      this.stakingFee = val;
    },
    setValidatorApr(val) {
      this.validatorApr = val;
    },
    addToPendingTxs(val) {
      this.stakewiseTxs.ETH(val);
    },
    addToPendingTxsGoerli(val) {
      this.stakewiseTxs.GOERLI(val);
    },
    removePendingTxs(val) {
      this.stakewiseTxs.ETH = this.stakewiseTxs.ETH.filter(item => {
        return item.hash !== val;
      });
    },
    removePendingTxsGoerli(val) {
      this.stakewiseTxs.GOERLI = this.stakewiseTxs.GOERLI.filter(item => {
        return item.hash !== val;
      });
    },
    setRewardBalance(val) {
      this.rethBalance = val;
    },
    setStakeBalance(val) {
      this.sethBalance = val;
    }
  },
  getters: {
    getPoolSupply(state) {
      return fromWei(toBNSafe(state.poolSupply));
    },
    getStakingFee(state) {
      return formatFloatingPointValue(BigNumber(state.stakingFee).div(100))
        .value;
    }
  }
};

export const useStakewiseStore = defineStore('stakewise', stakewise);
