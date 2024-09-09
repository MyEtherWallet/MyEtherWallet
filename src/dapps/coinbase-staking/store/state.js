import Configs from './configs';

const coinbaseStaking = {
  localStore: true,
  lastFetched: {
    HOLESKY: 0,
    ETH: 0
  },
  fetchedDetails: {
    HOLESKY: {},
    ETH: {}
  },
  stateVersion: Configs.VERSION.coinbaseStaking
};

export default coinbaseStaking;
