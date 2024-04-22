import State from './state';
import Actions from './actions';

const addressBook = {
  namespaced: true,
  state: State,

  actions: Actions,
  strict: false
};

export default addressBook;
