import { defineStore } from 'pinia';

import State from './state';
import Actions from './actions';

const ensManagerStore = {
  state: () => State,
  actions: Actions
};

export const useEnsManagerStore = defineStore(
  'ensManagerStore',
  ensManagerStore
);
