import localStore from 'store';
import Configs from './configs';

const INIT_STORE = function (state) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.stakedStore)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.stakedStore);
    if (savedStore.stateVersion === Configs.VERSION.stakedStore) {
      Object.assign(state, savedStore);
    }
  }
};

const ADD_VALIDATOR_INDEX = function (state, validatorId) {
  const newArray = state.validatorIndex.slice(); // no ref copy
  const found = newArray.find(item => item === validatorId);
  if (!found) {
    newArray.push(validatorId);
  }
  state.validatorIndex = newArray;
};

const ADD_WITHDRAWAL_INDEX = function (state, validatorId) {
  const newArray = state.withdrawalValidatorIndex.slice(); // no ref copy
  const found = newArray.find(item => item === validatorId);
  if (!found) {
    newArray.push(validatorId);
  }
  state.withdrawalValidatorIndex = newArray;
};

export default {
  INIT_STORE,
  ADD_VALIDATOR_INDEX,
  ADD_WITHDRAWAL_INDEX
};
