import Configs from './configs';

const stakedStore = {
  localStore: true,
  stateVersion: Configs.VERSION.stakedStore,
  validatorIndex: [],
  withdrawalValidatorIndex: []
};

export default stakedStore;
