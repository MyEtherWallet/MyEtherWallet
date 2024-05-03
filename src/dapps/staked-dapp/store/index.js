import { defineStore } from 'pinia';
import State from './state';
import Actions from './actions';

const stakedStore = {
  state: () => State,
  actions: Actions
};

export const useStakedStore = defineStore('stakedStore', stakedStore);
