import store from 'store';

const token = store.get('token') !== undefined ? store.get('token') : [];

const state = {
  token: token
};

export default state;
