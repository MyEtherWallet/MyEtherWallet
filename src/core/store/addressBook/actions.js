import localStore from 'store';
import Configs from '../configs';

const initStore = () => {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.custom)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.custom);
    if (savedStore.stateVersion === Configs.VERSION.custom) {
      this.$state = Object.assign(this.$state, savedStore);
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
