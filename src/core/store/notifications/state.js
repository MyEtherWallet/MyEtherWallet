import Configs from '../configs';

const state = {
  localStore: true,
  notifications: [],
  stateVersion: Configs.VERSION.notification,
  lastFetched: null
};

export default state;
