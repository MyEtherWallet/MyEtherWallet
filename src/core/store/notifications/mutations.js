// All mutations will have to receive an object
import localStore from 'store';
import Configs from '../configs';
import Notification from '@/modules/notifications/handler/NotificationInterface';
const INIT_STORE = function (state) {
  const fetchedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.notifications);
  if (fetchedStore && fetchedStore.notifications.length > 0) {
    fetchedStore.notifications = fetchedStore.notifications.map(item => {
      return new Notification(item);
    });
    if (fetchedStore.stateVersion === Configs.VERSION.notification) {
      Object.assign(state, fetchedStore);
    }
  }
};

const ADD_NOTIFICATION = function (state, obj) {
  state.notifications.push(obj);
};

const UPDATE_NOTIFICATION = function (state, obj) {
  state.notifications = state.notifications.map(item => {
    if (item.transactionHash === obj.transactionHash) {
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

export default {
  INIT_STORE,
  ADD_NOTIFICATION,
  UPDATE_NOTIFICATION,
  DELETE_NOTIFICATION
};
