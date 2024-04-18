import State from './state';
import Actions from './actions';
import Getters from './getters';

const external = {
  namespaced: true,
  state: State,
  actions: Actions,
  getters: Getters,
  strict: false
};

export default external;
