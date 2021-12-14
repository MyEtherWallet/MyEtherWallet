import ethBlocksTxs from './eth-blocks/store';
import EthBlockConfigs from './eth-blocks/store/configs';
const dappStore = {
  ethBlocksTxs: ethBlocksTxs
};

const dappStoreBeforeCreate = _store => {
  _store.commit('ethBlocksTxs/INIT_STORE');
};

const dappStoreConfigs = {
  LOCAL_STORAGE_KEYS: {
    ...EthBlockConfigs.LOCAL_STORAGE_KEYS
  },
  VERSION: {
    ...EthBlockConfigs.VERSION
  }
};

export { dappStore, dappStoreBeforeCreate, dappStoreConfigs };
