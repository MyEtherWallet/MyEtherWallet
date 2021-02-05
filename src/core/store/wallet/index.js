import State from './state';
import Mutations from './mutations';
import Actions from './actions';
import Getters from './getters';

const wallets = {
  namespaced: true,
  state: State,
  mutations: Mutations,
  getters: Getters,
  actions: Actions,
  strict: false
};

export default wallets;
