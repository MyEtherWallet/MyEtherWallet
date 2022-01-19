import ethBlocksTxs from './eth-blocks/store';
import stakewise from './stakewise/store';
import EthBlockConfigs from './eth-blocks/store/configs';
import StakewiseConfigs from './stakewise/store/configs';

const dappStore = {
  ethBlocksTxs: ethBlocksTxs,
  stakewise: stakewise
};

const dappStoreBeforeCreate = _store => {
  _store.commit('ethBlocksTxs/INIT_STORE');
  _store.commit('stakewise/INIT_STORE');
};

const dappStoreConfigs = {
  LOCAL_STORAGE_KEYS: {
    ...EthBlockConfigs.LOCAL_STORAGE_KEYS,
    ...StakewiseConfigs.LOCAL_STORAGE_KEYS
  },
  VERSION: {
    ...EthBlockConfigs.VERSION,
    ...StakewiseConfigs.VERSION
  }
};

export { dappStore, dappStoreBeforeCreate, dappStoreConfigs };
