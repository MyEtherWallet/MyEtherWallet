import ethBlocksTxs from './eth-blocks/store';
import stakewise from './stakewise/store';
import stakedStore from './staked-dapp/store';
import coinbaseStaking from './coinbase-staking/store';

import EthBlockConfigs from './eth-blocks/store/configs';
import EnsManagerStore from './ens-manager-dapp/store/configs';
import StakewiseConfigs from './stakewise/store/configs';
import StakedConfigs from './staked-dapp/store/configs';
import CoinbaseStaking from './coinbase-staking/store/configs';

const dappStore = {
  ethBlocksTxs: ethBlocksTxs,
  ensManagerStore: EnsManagerStore,
  stakewise: stakewise,
  stakedStore: stakedStore,
  coinbaseStaking: coinbaseStaking
};

const dappStoreBeforeCreate = _store => {
  _store.commit('ethBlocksTxs/INIT_STORE');
  _store.commit('stakewise/INIT_STORE');
  _store.commit('stakedStore/INIT_STORE');
  _store.commit('coinbaseStaking/INIT_STORE');
};

const dappStoreConfigs = {
  LOCAL_STORAGE_KEYS: {
    ...EthBlockConfigs.LOCAL_STORAGE_KEYS,
    ...EnsManagerStore.LOCAL_STORAGE_KEYS,
    ...StakewiseConfigs.LOCAL_STORAGE_KEYS,
    ...StakedConfigs.LOCAL_STORAGE_KEYS,
    ...CoinbaseStaking.LOCAL_STORAGE_KEYS
  },
  VERSION: {
    ...EthBlockConfigs.VERSION,
    ...EnsManagerStore.VERSION,
    ...StakewiseConfigs.VERSION,
    ...StakedConfigs.VERSION,
    ...CoinbaseStaking.VERSION
  }
};

export { dappStore, dappStoreBeforeCreate, dappStoreConfigs };
