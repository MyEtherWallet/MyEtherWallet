import Configs from './configs';

const ethBlocksTxs = {
  localStore: true,
  ethBlocksTxs: [],
  stateVersion: Configs.VERSION.ethBlocksTxs,
  cart: {
    ETH: []
  }
};

export default ethBlocksTxs;
