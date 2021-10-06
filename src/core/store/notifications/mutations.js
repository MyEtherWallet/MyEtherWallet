// All mutations will have to receive an object
import localStore from 'store';
import Configs from '../configs';
import Notification from '@/modules/notifications/handlers/handlerNotification';
const INIT_STORE = function (state) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.notifications)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.notifications);
    savedStore.notifications = savedStore.notifications.map(item => {
      delete item.notification;
      return new Notification(item);
    });
    if (savedStore.stateVersion === Configs.VERSION.notifications) {
      Object.assign(state, savedStore);
    }
  }
};

const ADD_NOTIFICATION = function (state, obj) {
  delete obj.notification;
  if (state.notifications.length >= 20) {
    state.notifications.shift();
  }
  state.notifications.push(obj);
};

const UPDATE_NOTIFICATION = function (state, obj) {
  delete obj.notification;

  state.notifications = state.notifications.map(item => {
    if (item.hash === obj.hash) {
      item = obj;
    }
    return item;
  });
};

const DELETE_NOTIFICATION = function (state, obj) {
  state.notifications = state.notifications.filter(item => {
    if (item.hash !== obj.hash) return item;
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
