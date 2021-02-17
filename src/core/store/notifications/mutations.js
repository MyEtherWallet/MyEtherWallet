// All mutations will have to receive an object
import localStore from 'store';
import Configs from '../configs';
const INIT_STORE = function (state) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.notifications)) {
    const savedStore = JSON.parse(
      localStore.get(Configs.LOCAL_STORAGE_KEYS.notifications)
    );
    if (savedStore.stateVersion === Configs.stateVersion) {
      Object.assign(state, savedStore);
    }
  }
};

const ADD_NOTIFICATION = function (state, obj) {
  // removes connection so notifcations can be updated once
  const arr = Array.splice.call(state.notifications);
  arr.push(obj);
  state.notifications = arr;
};

const UPDATE_NOTIFICATION = function (state, obj) {
  // removes connection so notifcations can be updated once
  const arr = Array.splice.call(state.notifications);
  const newMap = arr.map(item => {
    if (item.txHash === obj.txHash) {
      item = obj;
    }
    return item;
  });
  state.notifications = newMap;
};

const DELETE_NOTIFICATION = function (state, obj) {
  const arr = state.notifications;
  const idx = arr.findIndex(item => {
    if (item.txHash === obj.txHash) {
      return item;
    }
  });

  if (idx) arr.splice(idx, 1);
  state.notifications = arr;
};

export default {
  INIT_STORE,
  ADD_NOTIFICATION,
  UPDATE_NOTIFICATION,
  DELETE_NOTIFICATION
};
