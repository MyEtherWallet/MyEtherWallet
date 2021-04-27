import State from './state';
import Mutations from './mutations';
import Actions from './actions';

const swap = {
  namespaced: true,
  state: State,
  mutations: Mutations,
  actions: Actions,
  strict: false
};

export default swap;
