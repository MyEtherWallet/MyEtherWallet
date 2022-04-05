import { clone } from 'lodash';
import localStore from 'store';
import Configs from './configs';

const INIT_STORE = function (state) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.stakewise)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.stakewise);
    if (savedStore.stateVersion === Configs.VERSION.stakewise) {
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

const ADD_TO_PENDING_TXS = function (state, val) {
  const stakewiseTxs = clone(state.stakewiseTxs);
  stakewiseTxs.ETH.push(val);
  state.stakewiseTxs = stakewiseTxs;
};

const ADD_TO_PENDING_TXS_GOERLI = function (state, val) {
  const stakewiseTxs = clone(state.stakewiseTxs);
  stakewiseTxs.GOERLI.push(val);
  state.stakewiseTxs = stakewiseTxs;
};

const REMOVE_TO_PENDING_TXS = function (state, val) {
  const stakewiseTxs = clone(state.stakewiseTxs);
  state.stakewiseTxs.ETH = stakewiseTxs.ETH.filter(item => {
    return item.hash !== val;
  });
};

const REMOVE_TO_PENDING_TXS_GOERLI = function (state, val) {
  const stakewiseTxs = clone(state.stakewiseTxs);
  state.stakewiseTxs.GOERLI = stakewiseTxs.GOERLI.filter(item => {
    return item.hash !== val;
  });
};

export default {
  INIT_STORE,
  SET_POOL_SUPPLY,
  SET_STAKING_FEE,
  SET_VALIDATOR_APR,
  ADD_TO_PENDING_TXS,
  ADD_TO_PENDING_TXS_GOERLI,
  REMOVE_TO_PENDING_TXS,
  REMOVE_TO_PENDING_TXS_GOERLI
};
