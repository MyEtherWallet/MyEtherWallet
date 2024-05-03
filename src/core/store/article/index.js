import { defineStore } from 'pinia';

import State from './state';
import Actions from './actions';
import Getters from './getters';

const article = {
  state: () => State,
  actions: Actions,
  getters: Getters
};

export const useArticleStore = defineStore('article', article);
