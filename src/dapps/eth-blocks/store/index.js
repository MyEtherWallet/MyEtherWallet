import State from './state';
import Actions from './actions';
import Getters from './getters';

const ethBlocksTxs = {
  namespaced: true,
  state: State,
  actions: Actions,
  getters: Getters,
  strict: false
};

export default ethBlocksTxs;
