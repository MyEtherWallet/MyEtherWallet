const COINBASE_STAKING_ROUTES = {
  CORE: {
    NAME: 'CoinbaseStaking',
    PATH: 'coinbase-staking'
  }
};

import { ETH, GOERLI } from '@/utils/networks/types';

const SUPPORTED_NETWORKS = [ETH, GOERLI];
export { COINBASE_STAKING_ROUTES, SUPPORTED_NETWORKS };
