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

const ADD_VALIDATOR_INDEX = function (state, validatorId) {
  const newArray = state.validatorIndex.slice(); // no ref copy
  newArray.push(validatorId);
  state.validatorIndex = newArray;
};

export default {
  INIT_STORE,
  ADD_VALIDATOR_INDEX
};
