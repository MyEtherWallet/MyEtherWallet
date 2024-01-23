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

import { ETH, GOERLI } from '@/utils/networks/types';

const SUPPORTED_NETWORKS = [ETH, GOERLI];
const API = 'https://coinbase-staking.mewapi.io/staking';

export { COINBASE_STAKING_ROUTES, SUPPORTED_NETWORKS, API, CB_TRACKING };
