import { defineStore } from 'pinia';
import State from './state';
import Actions from './actions';

const addressBook = {
  state: () => State,
  actions: Actions
};

export const useAddressBookStore = defineStore('addressBook', addressBook);
