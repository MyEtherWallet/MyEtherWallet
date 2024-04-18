import State from './state';
import Actions from './actions';

const swap = {
  namespaced: true,
  state: State,
  actions: Actions,
  strict: false
};

export default swap;
