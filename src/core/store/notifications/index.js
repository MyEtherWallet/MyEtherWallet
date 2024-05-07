import { defineStore } from 'pinia';
import localStore from 'store';
import Configs from '../configs';
import Notification from '@/modules/notifications/handlers/handlerNotification';
import NonChainNotification from '@/modules/notifications/handlers/nonChainNotification';
import { useGlobalStore } from '../global';
import { useWalletStore } from '../wallet';

import { NOTIFICATION_TYPES } from '@/modules/notifications/handlers/handlerNotification';

const notifications = {
  state: () => ({
    localStore: true,
    notifications: [],
    stateVersion: '1.0.4'
  }),
  actions: {
    initStore() {
      if (localStore.get(Configs.LOCAL_STORAGE_KEYS.notifications)) {
        const savedStore = localStore.get(
          Configs.LOCAL_STORAGE_KEYS.notifications
        );
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
    },

    addNotification(obj) {
      delete obj.notification;
      if (this.notifications.length >= 20) {
        this.notifications.shift();
      }
      this.notifications.push(obj);
    },
    updateNotification(obj) {
      delete obj.notification;

      this.notifications = this.notifications.map(item => {
        if (item.hash === obj.hash) {
          item = obj;
        }
        return item;
      });
    },
    deleteNotification(obj) {
      this.notifications = this.notifications.filter(item => {
        if (item.hash !== obj.hash) return item;
      });
    }
  },
  getters: {
    currentNotifications(state) {
      const { address } = useWalletStore();
      const { network } = useGlobalStore();

      const currentNetworkType = network.type.name;
      const filteredArray = state.notifications.filter(item => {
        if (
          item.from?.toLowerCase() === address?.toLowerCase() &&
          item.network === currentNetworkType
        )
          return item;
      });
      return state.notifications.length > 0 ? filteredArray : [];
    },

    txNotifications(state) {
      const { address } = useWalletStore();
      const { network } = useGlobalStore();

      const currentNetworkType = network.type.name;
      const filteredArray = state.notifications.filter(item => {
        if (
          item.from?.toLowerCase() === address?.toLowerCase() &&
          item.type === NOTIFICATION_TYPES.OUT &&
          item.network === currentNetworkType
        )
          return item;
      });
      return state.notifications.length > 0 ? filteredArray : [];
    },

    swapNotifications(state) {
      const { address } = useWalletStore();
      const { network } = useGlobalStore();

      const currentNetworkType = network.type.name;
      const filteredArray = state.notifications.filter(item => {
        if (
          item.from?.toLowerCase() === address?.toLowerCase() &&
          item.type === NOTIFICATION_TYPES.SWAP &&
          item.network === currentNetworkType
        )
          return item;
      });
      return state.notifications.length > 0 ? filteredArray : [];
    }
  }
};

export const useNotificationsStore = defineStore(
  'notifications',
  notifications
);
