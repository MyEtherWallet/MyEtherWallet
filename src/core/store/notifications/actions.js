import localStore from 'store';
import Configs from '../configs';
import Notification from '@/modules/notifications/handlers/handlerNotification';
import NonChainNotification from '@/modules/notifications/handlers/nonChainNotification';

const initStore = () => {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.notifications)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.notifications);
    savedStore.notifications = savedStore.notifications.map(item => {
      delete item.notification;
      return item.hasOwnProperty('hash')
        ? new Notification(item)
        : new NonChainNotification(item);
    });
    if (savedStore.stateVersion === Configs.VERSION.notifications) {
      this.$patch(Object.assign(this.$state, savedStore));
    }
  }
};

const addNotification = obj => {
  delete obj.notification;
  if (this.notifications.length >= 20) {
    this.notifications.shift();
  }
  this.notifications.push(obj);
};
const updateNotification = obj => {
  delete obj.notification;

  this.notifications = this.notifications.map(item => {
    if (item.hash === obj.hash) {
      item = obj;
    }
    return item;
  });
};
const deleteNotification = obj => {
  this.notifications = this.notifications.filter(item => {
    if (item.hash !== obj.hash) return item;
  });
};

export default {
  initStore,
  addNotification,
  updateNotification,
  deleteNotification
};
