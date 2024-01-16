import Configs from './configs';

const ensManagerStore = {
  localStore: true,
  lastFetched: '',
  fetchedDetails: {},
  stateVersion: Configs.VERSION.ensManagerStore
};

export default ensManagerStore;
