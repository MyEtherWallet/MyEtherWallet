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

const CB_TRACKING = {
  CLICK_STAKE: 'coinbaseStakingStakeButton',
  STAKE_SUCCESS: 'coinbaseStakingStakeSuccess',
  STAKE_FAIL: 'coinbaseStakingStakeFail',
  CLICK_UNSTAKE: 'coinbaseStakingUnstakeButton',
  UNSTAKE_SUCCESS: 'coinbaseStakingUnstakeSuccess',
  UNSTAKE_FAIL: 'coinbaseStakingUnstakeFail',
  CLICK_CLAIM: 'coinbaseStakingClaimButton',
  CLAIM_SUCCESS: 'coinbaseStakingClaimSuccess',
  CLAIM_FAIL: 'coinbaseStakingClaimFail'
};

import { ETH, HOLESKY } from '@/utils/networks/types';

const SUPPORTED_NETWORKS = [ETH, HOLESKY];
const API = 'https://coinbase-staking.mewapi.io/staking';
const MIN_GAS_LIMIT = 400000;

export {
  COINBASE_STAKING_ROUTES,
  SUPPORTED_NETWORKS,
  API,
  CB_TRACKING,
  MIN_GAS_LIMIT
};
