import { defineStore } from 'pinia';

import State from './state';
import Actions from './actions';
import Getters from './getters';

console.log(Getters);
const globalModule = {
  state: () => State,
  actions: Actions,
  getters: Getters
};

export const useGlobalStore = defineStore('global', globalModule);
// implement later
// store.subscribe((mutation, state) => {
//   const modules = Object.keys(state);
//   modules.forEach(m => {
//     if (mutation.type.startsWith(m) && state[m].localStore) {
//       LocalStore.set(Configs.LOCAL_STORAGE_KEYS[m], state[m]);
//     }
//   });
// });
