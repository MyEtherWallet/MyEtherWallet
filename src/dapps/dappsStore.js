import ensManagerStore from './ens-manager-dapp/store';
import ethBlocksTxs from './eth-blocks/store';
import EthBlockConfigs from './eth-blocks/store/configs';
import EnsManagerStore from './ens-manager-dapp/store/configs';
const dappStore = {
  ethBlocksTxs: ethBlocksTxs,
  ensManagerStore: ensManagerStore
};

const dappStoreBeforeCreate = _store => {
  _store.commit('ethBlocksTxs/INIT_STORE');
  _store.commit('ensManagerStore/INIT_STORE');
};

const dappStoreConfigs = {
  LOCAL_STORAGE_KEYS: {
    ...EthBlockConfigs.LOCAL_STORAGE_KEYS,
    ...EnsManagerStore.LOCAL_STORAGE_KEYS
  },
  VERSION: {
    ...EthBlockConfigs.VERSION,
    ...EnsManagerStore.VERSION
  }
};

export { dappStore, dappStoreBeforeCreate, dappStoreConfigs };
