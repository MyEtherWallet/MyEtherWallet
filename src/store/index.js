import Vue from 'vue';
import Vuex from 'vuex';
import State from './state.js';
import Mutations from './mutations.js';
import Actions from './actions.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: State,
  mutations: Mutations,
  actions: Actions,
  strict: false
});
