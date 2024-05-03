import { defineStore } from 'pinia';

import State from './state';
import Actions from './actions';
import Getters from './getters';

const custom = {
  state: () => State,
  actions: Actions,
  getters: Getters
};

export const useCustomStore = defineStore('custom', custom);
