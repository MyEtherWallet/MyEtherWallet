import localStore from 'store';
import Configs from '../configs';

const initStore = () => {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.addressBook)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.addressBook);
    if (savedStore.stateVersion === Configs.VERSION.addressBook) {
      this.$patch(Object.assign(this.$state, savedStore));
    }
  }
};

/**
 * Sets address book
 * @param Array addressBook
 */

const setAddressBook = function (addressBook) {
  this.addressBook = addressBook;
};

const setMigrated = function (isMigrated) {
  this.isMigrated = isMigrated;
};

export default { setAddressBook, setMigrated, initStore };
