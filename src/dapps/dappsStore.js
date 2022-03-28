import ethBlocksTxs from './eth-blocks/store';
import stakewise from './stakewise/store';
import EthBlockConfigs from './eth-blocks/store/configs';
import EnsManagerStore from './ens-manager-dapp/store/configs';
import StakewiseConfigs from './stakewise/store/configs';

const dappStore = {
  ethBlocksTxs: ethBlocksTxs,
  ensManagerStore: EnsManagerStore,
  stakewise: stakewise
};

const dappStoreBeforeCreate = _store => {
  _store.commit('ethBlocksTxs/INIT_STORE');
  _store.commit('ensManagerStore/INIT_STORE');
  _store.commit('stakewise/INIT_STORE');
};

const dappStoreConfigs = {
  LOCAL_STORAGE_KEYS: {
    ...EthBlockConfigs.LOCAL_STORAGE_KEYS,
    ...EnsManagerStore.LOCAL_STORAGE_KEYS,
    ...StakewiseConfigs.LOCAL_STORAGE_KEYS
  },
  VERSION: {
    ...EthBlockConfigs.VERSION,
    ...EnsManagerStore.VERSION,
    ...StakewiseConfigs.VERSION
  }
};

export { dappStore, dappStoreBeforeCreate, dappStoreConfigs };
