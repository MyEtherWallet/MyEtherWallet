import store from 'store';
class Storage {
  constructor() {
    this.store = store;
  }
  set(key, value) {
    try {
      store.set(key, value);
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  get(key) {
    return Promise.resolve(store.get(key));
  }
  remove(key) {
    return Promise.resolve(store.remove(key));
  }
  clearAll() {
    return Promise.resolve(store.clearAll());
  }
  each(fn) {
    store.each(fn);
  }
}
export default Storage;
