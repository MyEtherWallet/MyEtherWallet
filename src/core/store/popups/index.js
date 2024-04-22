import State from './state';
import Actions from './actions';

const globalModule = {
  namespaced: true,
  state: State,
  actions: Actions,
  strict: false
};

export default globalModule;
