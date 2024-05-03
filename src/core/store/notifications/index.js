import { defineStore } from 'pinia';

import State from './state';
import Actions from './actions';
import Getters from './getters';

const notifications = {
  state: () => State,
  actions: Actions,
  getters: Getters
};

export const useNotificationsStore = defineStore(
  'notifications',
  notifications
);
