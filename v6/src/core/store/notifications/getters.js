import { NOTIFICATION_TYPES } from '@/modules/notifications/handlers/handlerNotification';

const currentNotifications = function (state, _, rootState, rootGetters) {
  const address = rootState.wallet.address;
  const currentNetworkType = rootGetters['global/network'].type.name;
  const filteredArray = state.notifications.filter(item => {
    if (
      item.from?.toLowerCase() === address?.toLowerCase() &&
      item.network === currentNetworkType
    )
      return item;
  });
  return state.notifications.length > 0 ? filteredArray : [];
};

const txNotifications = function (state, _, rootState, rootGetters) {
  const address = rootState.wallet.address;
  const currentNetworkType = rootGetters['global/network'].type.name;
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

const swapNotifications = function (state, _, rootState, rootGetters) {
  const address = rootState.wallet.address;
  const currentNetworkType = rootGetters['global/network'].type.name;
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
