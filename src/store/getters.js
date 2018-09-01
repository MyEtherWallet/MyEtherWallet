const account = state => {
  return state.account;
};

const all = state => {
  return state;
};

const network = state => {
  return state.network;
};

const notifications = state => {
  return state.notifications;
};

const online = state => {
  return state.online;
};

const wallet = state => {
  return state.wallet;
};

export default {
  account,
  all,
  network,
  notifications,
  online,
  wallet
};
