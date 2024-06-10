import { defineStore, computed } from 'pinia';
import { ref } from 'vue';
import store from 'store';
import Configs from '../configs';
import Notification from '@/modules/notifications/handlers/handlerNotification';
import NonChainNotification from '@/modules/notifications/handlers/nonChainNotification';
import { useGlobalStore } from '../global';
import { useWalletStore } from '../wallet';

import { NOTIFICATION_TYPES } from '@/modules/notifications/handlers/handlerNotification';

export const useNotificationsStore = defineStore('notifications', () => {
  // data
  const localStore = true;
  const stateVersion = '1.0.4';
  const notifications = ref([]);

  // actions
  const initStore = () => {
    if (store.get(Configs.LOCAL_STORAGE_KEYS.notifications)) {
      const savedStore = store.get(Configs.LOCAL_STORAGE_KEYS.notifications);
      savedStore.notifications = savedStore.notifications.map(item => {
        delete item.notification;
        return item.hasOwnProperty('hash')
          ? new Notification(item)
          : new NonChainNotification(item);
      });
      if (savedStore.stateVersion === Configs.VERSION.notifications) {
        $patch(Object.assign($state, savedStore));
      }
    }
  };
  const addNotification = obj => {
    delete obj.notification;
    if (notifications.value.length >= 20) {
      notifications.value.shift();
    }
    notifications.value.push(obj);
  };
  const updateNotification = obj => {
    delete obj.notification;

    notifications.value = notifications.value.map(item => {
      if (item.hash === obj.hash) {
        item = obj;
      }
      return item;
    });
  };
  const deleteNotification = obj => {
    notifications.value = notifications.value.filter(item => {
      if (item.hash !== obj.hash) return item;
    });
  };

  // getters
  const currentNotifications = computed(() => {
    const { address } = useWalletStore();
    const { network } = useGlobalStore();

    const currentNetworkType = network.type.name;
    const filteredArray = notifications.value.filter(item => {
      if (
        item.from?.toLowerCase() === address?.toLowerCase() &&
        item.network === currentNetworkType
      )
        return item;
    });
    return notifications.value.length > 0 ? filteredArray : [];
  });

  const txNotifications = computed(() => {
    const { address } = useWalletStore();
    const { network } = useGlobalStore();

    const currentNetworkType = network.type.name;
    const filteredArray = notifications.value.filter(item => {
      if (
        item.from?.toLowerCase() === address?.toLowerCase() &&
        item.type === NOTIFICATION_TYPES.OUT &&
        item.network === currentNetworkType
      )
        return item;
    });
    return notifications.value.length > 0 ? filteredArray : [];
  });

  const swapNotifications = computed(() => {
    const { address } = useWalletStore();
    const { network } = useGlobalStore();

    const currentNetworkType = network.type.name;
    const filteredArray = notifications.value.filter(item => {
      if (
        item.from?.toLowerCase() === address?.toLowerCase() &&
        item.type === NOTIFICATION_TYPES.SWAP &&
        item.network === currentNetworkType
      )
        return item;
    });
    return notifications.value.length > 0 ? filteredArray : [];
  });
  return {
    localStore,
    notifications,
    stateVersion,
    initStore,
    addNotification,
    updateNotification,
    deleteNotification,
    currentNotifications,
    txNotifications,
    swapNotifications
  };
});
