import State from './state';
import Actions from './actions';

const stakedStore = {
  namespaced: true,
  state: State,
  actions: Actions,
  strict: false
};

export default stakedStore;
