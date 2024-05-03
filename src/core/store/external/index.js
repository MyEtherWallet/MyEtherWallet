import { defineStore } from 'pinia';

import State from './state';
import Actions from './actions';
import Getters from './getters';

const external = {
  state: () => State,
  actions: Actions,
  getters: Getters
};

export const useExternalStore = defineStore('external', external);
