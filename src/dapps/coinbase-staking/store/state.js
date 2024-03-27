import Configs from './configs';

const coinbaseStaking = {
  localStore: true,
  lastFetched: {
    GOERLI: 0,
    HOLESKY: 0,
    ETH: 0
  },
  fetchedDetails: {
    GOERLI: {},
    HOLESKY: {},
    ETH: {}
  },
  stateVersion: Configs.VERSION.coinbaseStaking
};

export default coinbaseStaking;
