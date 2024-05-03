import { defineStore } from 'pinia';
import State from './state';
import Actions from './actions';

const swap = {
  state: () => State,
  actions: Actions
};

export const useSwapStore = defineStore('swap', swap);
