import Vue from 'vue';
import Vuex from 'vuex';
import State from './state';
import Getters from './getters';
import Mutations from './mutations';
import Actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store({
  state: State,
  mutations: Mutations,
  getters: Getters,
  actions: Actions,
  strict: false
});
