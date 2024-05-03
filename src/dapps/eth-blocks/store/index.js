import { defineStore } from 'pinia';

import State from './state';
import Actions from './actions';
import Getters from './getters';

const ethBlocksTxs = {
  state: () => State,
  actions: Actions,
  getters: Getters
};

export const useEthBlocksTxsStore = defineStore('ethBlocksTxs', ethBlocksTxs);
