import { notificationTypes } from '@/modules/notifications/configs/configTypes';

const currentNotifications = function (state, _, rootState, rootGetters) {
  const address = rootState.wallet.address;
  const currentNetworkType = rootGetters['global/network'].type.name;
  const filteredArray = state.notifications.filter(item => {
    if (
      item.from.toLowerCase() === address.toLowerCase() &&
      item.network === currentNetworkType
    )
      return item;
  });
  return filteredArray;
};

const txNotifications = function (state, _, rootState, rootGetters) {
  const address = rootState.wallet.address;
  const currentNetworkType = rootGetters['global/network'].type.name;
  const filteredArray = state.notifications.filter(item => {
    if (
      item.from.toLowerCase() === address.toLowerCase() &&
      item.type.toLowerCase() === notificationTypes.out &&
      item.network === currentNetworkType
    )
      return item;
  });
  return filteredArray;
};

const swapNotifications = function (state, _, rootState, rootGetters) {
  const address = rootState.wallet.address;
  const currentNetworkType = rootGetters['global/network'].type.name;
  const filteredArray = state.notifications.filter(item => {
    if (
      item.from.toLowerCase() === address.toLowerCase() &&
      item.type.toLowerCase() === notificationTypes.swap &&
      item.network === currentNetworkType
    )
      return item;
  });
  return filteredArray;
};

export default { currentNotifications, txNotifications, swapNotifications };
