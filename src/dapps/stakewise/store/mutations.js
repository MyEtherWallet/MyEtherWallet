import localStore from 'store';
import Configs from './configs';

const INIT_STORE = function (state) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.ethBlocksTxs)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.ethBlocksTxs);
    if (savedStore.stateVersion === Configs.VERSION.ethBlocksTxs) {
      Object.assign(state, savedStore);
    }
  }
};

const SET_POOL_SUPPLY = function (state, val) {
  state.poolSupply = val;
};
const SET_STAKING_FEE = function (state, val) {
  state.stakingFee = val;
};
const SET_VALIDATOR_APR = function (state, val) {
  state.validatorApr = val;
};

export default {
  INIT_STORE,
  SET_POOL_SUPPLY,
  SET_STAKING_FEE,
  SET_VALIDATOR_APR
};
