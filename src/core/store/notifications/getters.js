const currentNotifcations = function (state, _, rootState) {
  const address = rootState.wallet.address;
  const filteredArray = state.notifications.filter(item => {
    if (item.toAddress === address) return item;
  });
  return filteredArray;
};

const txNotifications = function (state, _, rootState) {
  const address = rootState.wallet.address;
  const filteredArray = state.notifications.filter(item => {
    if (item.toAddress === address && item.type === 'OUT') return item;
  });
  return filteredArray;
};

const swapNotifications = function (state, _, rootState) {
  const address = rootState.wallet.address;
  const filteredArray = state.notifications.filter(item => {
    if (item.toAddress === address && item.type === 'SWAP') return item;
  });
  return filteredArray;
};

export default { currentNotifcations, txNotifications, swapNotifications };
