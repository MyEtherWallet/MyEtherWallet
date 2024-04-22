import {
  wallet as useWalletStore,
  global as useGlobalStore
} from '@/core/store/index.js';

import { NOTIFICATION_TYPES } from '@/modules/notifications/handlers/handlerNotification';

const currentNotifications = function (state) {
  const walletStore = useWalletStore();
  const globalStore = useGlobalStore();

  const address = walletStore.address;
  const currentNetworkType = globalStore.network.type.name;
  const filteredArray = state.notifications.filter(item => {
    if (
      item.from?.toLowerCase() === address?.toLowerCase() &&
      item.network === currentNetworkType
    )
      return item;
  });
  return state.notifications.length > 0 ? filteredArray : [];
};

const txNotifications = function (state) {
  const walletStore = useWalletStore();
  const globalStore = useGlobalStore();

  const address = walletStore.address;
  const currentNetworkType = globalStore.network.type.name;
  const filteredArray = state.notifications.filter(item => {
    if (
      item.from?.toLowerCase() === address?.toLowerCase() &&
      item.type === NOTIFICATION_TYPES.OUT &&
      item.network === currentNetworkType
    )
      return item;
  });
  return state.notifications.length > 0 ? filteredArray : [];
};

const swapNotifications = function (state) {
  const walletStore = useWalletStore();
  const globalStore = useGlobalStore();

  const address = walletStore.address;
  const currentNetworkType = globalStore.network.type.name;
  const filteredArray = state.notifications.filter(item => {
    if (
      item.from?.toLowerCase() === address?.toLowerCase() &&
      item.type === NOTIFICATION_TYPES.SWAP &&
      item.network === currentNetworkType
    )
      return item;
  });
  return state.notifications.length > 0 ? filteredArray : [];
};

export default { currentNotifications, txNotifications, swapNotifications };
