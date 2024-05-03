import { defineStore } from 'pinia';

import State from './state';
import Actions from './actions';
import Getters from './getters';

const wallets = {
  state: () => State,
  actions: Actions,
  getters: Getters
};

export const useWalletStore = defineStore('wallets', wallets);
