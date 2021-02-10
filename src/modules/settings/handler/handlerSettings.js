import vuexStore from '@/core/store';
import { mapActions } from 'vuex';
import { toWei } from 'web3-utils';

const VALID_FIELDS = [];
export default class Settings {
  constructor() {
    this.$store = vuexStore;
    Object.assign(this, mapActions('global', ['setImportedState']));
  }

  import(obj) {
    this.setImportedState(obj);
  }

  exportStore() {
    // convert gasPrice to string
  }

  _validateImportObject(obj) {}
}
