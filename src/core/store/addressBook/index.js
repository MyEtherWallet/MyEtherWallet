import { defineStore } from 'pinia';

import localStore from 'store';
import Configs from '../configs';

const addressBook = {
  state: () => ({
    localStore: true,
    addressBookStore: [],
    isMigrated: false,
    stateVersion: '1.0.0'
  }),
  actions: {
    initStore() {
      if (localStore.get(Configs.LOCAL_STORAGE_KEYS.addressBook)) {
        const savedStore = localStore.get(
          Configs.LOCAL_STORAGE_KEYS.addressBook
        );
        if (savedStore.stateVersion === Configs.VERSION.addressBook) {
          this.$patch(Object.assign(this.$state, savedStore));
        }
      }
    },

    /**
     * Sets address book
     * @param Array addressBook
     */

    setAddressBook(val) {
      this.addressBook = val;
    },

    setMigrated(val) {
      this.isMigrated = val;
    }
  }
};

export const useAddressBookStore = defineStore('addressBook', addressBook);
