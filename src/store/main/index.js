import State from './state';
import Mutations from './mutations';
import Actions from './actions';

const main = {
  namespaced: true,
  state: State,
  mutations: Mutations,
  actions: Actions,
  strict: false
};

export default main;
