import Configs from '../configs';

const state = {
  localStore: true,
  articleStore: {},
  timestamp: new Date().getTime(),
  stateVersion: Configs.VERSION.article
};

export default state;
