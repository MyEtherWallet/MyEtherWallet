import State from './state';
import Mutations from './mutations';
import Actions from './actions';
import Getters from './getters';

const notifications = {
  namespaced: true,
  state: State,
  mutations: Mutations,
  actions: Actions,
  getters: Getters,
  strict: false
};

export default notifications;
