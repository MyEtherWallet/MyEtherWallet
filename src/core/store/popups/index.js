import { defineStore } from 'pinia';

import State from './state';
import Actions from './actions';

const popupModule = {
  state: () => State,
  actions: Actions
};

export const usePopupStore = defineStore('popups', popupModule);
