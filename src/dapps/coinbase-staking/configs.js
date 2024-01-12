const COINBASE_STAKING_ROUTES = {
  CORE: {
    NAME: 'Coinbase',
    PATH: 'coinbase'
  },
  STAKE: {
    NAME: 'CoinbaseStaking',
    PATH: 'staking'
  },
  UNSTAKE: {
    NAME: 'CoinbaseUnstaking',
    PATH: 'unstaking'
  }
};

import { ETH, GOERLI } from '@/utils/networks/types';

const SUPPORTED_NETWORKS = [ETH, GOERLI];
export { COINBASE_STAKING_ROUTES, SUPPORTED_NETWORKS };
