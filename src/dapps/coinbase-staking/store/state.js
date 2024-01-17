import Configs from './configs';

const coinbaseStaking = {
  localStore: true,
  lastFetched: 0,
  fetchedDetails: {
    GOERLI: {},
    ETH: {}
  },
  stateVersion: Configs.VERSION.coinbaseStaking
};

export default coinbaseStaking;
