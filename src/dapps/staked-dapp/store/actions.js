import localStore from 'store';
import Configs from './configs';

const initStore = function () {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.stakedStore)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.stakedStore);
    if (savedStore.stateVersion === Configs.VERSION.stakedStore) {
      this.$state = Object.assign(this.$state, savedStore);
    }
  }
};

const addValidatorIndex = function (validatorId) {
  const newArray = this.validatorIndex.slice(); // no ref copy
  const found = newArray.find(item => item === validatorId);
  if (!found) {
    newArray.push(validatorId);
  }
  this.validatorIndex = newArray;
};
const addWithdrawalValidatorIndex = function (validatorId) {
  const newArray = this.withdrawalValidatorIndex.slice(); // no ref copy
  const found = newArray.find(item => item === validatorId);
  if (!found) {
    newArray.push(validatorId);
  }
  this.withdrawalValidatorIndex = newArray;
};

export default {
  initStore,
  addValidatorIndex,
  addWithdrawalValidatorIndex
};
