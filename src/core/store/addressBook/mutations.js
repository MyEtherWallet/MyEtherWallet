import localStore from 'store';
import Configs from '../configs';

const INIT_STORE = function (state) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.addressBook)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.addressBook);
    if (savedStore.stateVersion === Configs.VERSION.addressBook) {
      Object.assign(state, savedStore);
    }
  }
};

const SET_ADDRESS_BOOK = function (state, val) {
  state.addressBookStore = val;
};

const SET_MIGRATED = function (state, val) {
  state.isMigrated = val;
};

export default { SET_ADDRESS_BOOK, INIT_STORE, SET_MIGRATED };
