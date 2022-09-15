import Configs from '../configs';

const state = {
  localStore: true,
  tokens: {},
  paths: [],
  stateVersion: Configs.VERSION.custom,
  addressBook: [],
  hiddenTokens: {}
};

export default state;
