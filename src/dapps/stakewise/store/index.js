import { defineStore } from 'pinia';

import State from './state';
import Actions from './actions';
import Getters from './getters';

const stakewise = {
  state: () => State,
  actions: Actions,
  getters: Getters
};

export const useStakewiseStore = defineStore('stakewise', stakewise);
