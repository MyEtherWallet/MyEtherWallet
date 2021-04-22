// All mutations will have to receive an object
import localStore from 'store';
import Configs from '../configs';
import Notification from '@/modules/notifications/handlers/handlerNotification';
const INIT_STORE = function (state) {
  const fetchedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.notifications);
  if (fetchedStore) {
    if (fetchedStore.notifications.length > 0) {
      fetchedStore.notifications = fetchedStore.notifications.map(item => {
        delete item.notification;
        return new Notification(item);
      });
    }
    if (fetchedStore.stateVersion === Configs.VERSION.notification) {
      Object.assign(state, fetchedStore);
    }
  }
};

const ADD_NOTIFICATION = function (state, obj) {
  delete obj.notification;
  state.notifications.push(obj);
  if (state.notifications.length >= 20) {
    state.notifications.shift();
    state.notifications.push(obj);
  }
};

const UPDATE_NOTIFICATION = function (state, obj) {
  delete obj.notification;

  state.notifications = state.notifications.map(item => {
    const itemTxHash = item.transactionHash || item.hash;
    const objTxHash = obj.transactionHash || obj.hash;
    if (itemTxHash === objTxHash) {
      item = obj;
    }
    return item;
  });
};

const DELETE_NOTIFICATION = function (state, obj) {
  state.notifications = state.notifications.filter(item => {
    if (item.transactionHash !== obj.transactionHash) return item;
  });
};

const SET_FETCHED_TIME = function (state) {
  state.lastFetched = new Date().getTime();
};

export default {
  INIT_STORE,
  ADD_NOTIFICATION,
  UPDATE_NOTIFICATION,
  DELETE_NOTIFICATION,
  SET_FETCHED_TIME
};
