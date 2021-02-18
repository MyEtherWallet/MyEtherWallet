// All mutations will have to receive an object
import localStore from 'store';
import Configs from '../configs';
import Notification from '@/modules/notifications/handler/NotificationInterface';
const INIT_STORE = function (state) {
  const fetchedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.notifications);
  if (fetchedStore && fetchedStore.notifications.length > 0) {
    const savedStore = fetchedStore.notifications.map(item => {
      const {
        txHash,
        toAddress,
        fromAddress,
        gasPrice,
        transactionFee,
        date,
        status,
        fromTxData,
        toTxData,
        type,
        read,
        nonce
      } = item;
      return new Notification(
        txHash,
        toAddress,
        fromAddress,
        gasPrice,
        transactionFee,
        date,
        status,
        fromTxData,
        toTxData,
        type,
        read,
        nonce
      );
    });
    if (savedStore.stateVersion === Configs.stateVersion) {
      Object.assign(state, savedStore);
    }
  }
};

const ADD_NOTIFICATION = function (state, obj) {
  // removes connection so notifcations can be updated once
  const arr = Array.prototype.splice.call(state.notifications);
  arr.push(obj);
  console.log(arr, state.notifications);
  state.notifications = arr;
};

const UPDATE_NOTIFICATION = function (state, obj) {
  // removes connection so notifcations can be updated once
  const arr = Array.prototype.splice.call(state.notifications);
  const newMap = arr.map(item => {
    if (item.txHash === obj.txHash) {
      item = obj;
    }
    return item;
  });
  state.notifications = newMap;
};

const DELETE_NOTIFICATION = function (state, obj) {
  const arr = Array.prototype.splice.call(state.notifications);
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
