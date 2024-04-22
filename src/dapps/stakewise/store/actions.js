import localStore from 'store';
import Configs from './configs';

const initStore = function () {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.stakewise)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.stakewise);
    if (savedStore.stateVersion === Configs.VERSION.stakewise) {
      this.$state = Object.assign(this.$state, savedStore);
    }
  }
};

const setPoolSupply = function (val) {
  this.poolSupply = val;
};
const setStakingFee = function (val) {
  this.stakingFee = val;
};
const setValidatorApr = function (val) {
  this.validatorApr = val;
};
const addToPendingTxs = function (val) {
  this.stakewiseTxs.ETH(val);
};
const addToPendingTxsGoerli = function (val) {
  this.stakewiseTxs.GOERLI(val);
};
const removePendingTxs = function (val) {
  this.stakewiseTxs.ETH = this.stakewiseTxs.ETH.filter(item => {
    return item.hash !== val;
  });
};
const removePendingTxsGoerli = function (val) {
  this.stakewiseTxs.GOERLI = this.stakewiseTxs.GOERLI.filter(item => {
    return item.hash !== val;
  });
};

const setRewardBalance = function (val) {
  this.rethBalance = val;
};

const setStakeBalance = function (val) {
  this.sethBalance = val;
};

export default {
  initStore,
  setPoolSupply,
  setStakingFee,
  setValidatorApr,
  addToPendingTxs,
  addToPendingTxsGoerli,
  removePendingTxs,
  removePendingTxsGoerli,
  setRewardBalance,
  setStakeBalance
};
