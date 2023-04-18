import Configs from './configs';

const stakedStore = {
  localStore: true,
  stateVersion: Configs.VERSION.stakedStore,
  validatorIndex: []
};

export default stakedStore;
