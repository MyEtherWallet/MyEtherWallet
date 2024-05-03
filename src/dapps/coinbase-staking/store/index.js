import { defineStore } from 'pinia';

import State from './state';
import Actions from './actions';

const coinbaseStaking = {
  state: () => State,
  actions: Actions
};

export const useCoinbaseStakingStore = defineStore(
  'coinbaseStaking',
  coinbaseStaking
);
