import { ref } from 'vue';
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

export const useAddressBookStore = defineStore('addressBook', () => {
  const localStore = ref(true);
  const addressBookStore = ref([]);
  const isMigrated = ref(false);
  const stateVersion = ref('1.0.0');

  // actions
  const initStore = () => {
    if (store.get(Configs.LOCAL_STORAGE_KEYS.addressBook)) {
      const savedStore = store.get(Configs.LOCAL_STORAGE_KEYS.addressBook);
      if (savedStore.stateVersion === Configs.VERSION.addressBook) {
        $patch(Object.assign($state, savedStore));
      }
    }
  };

  const setAddressBook = val => {
    addressBookStore.value = val;
  };

  const setMigrated = val => {
    isMigrated.value = val;
  };

  return {
    localStore,
    addressBookStore,
    isMigrated,
    stateVersion,
    initStore,
    setAddressBook,
    setMigrated
  };
});
