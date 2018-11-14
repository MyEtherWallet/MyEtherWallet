import nodeList from '@/networks';
import store from 'store';

if (store.get('notifications') === undefined) store.set('notifications', {});

const network =
  store.get('network') !== undefined
    ? store.get('network')
    : nodeList['ETH'][3];
const notifications =
  store.get('notifications') !== undefined ? store.get('notifications') : {};
const gasPrice =
  store.get('gasPrice') !== undefined ? store.get('gasPrice') : 41;

const customPaths =
  store.get('customPaths') !== undefined ? store.get('customPaths') : {};
const lastPath =
  store.get('lastPath') !== undefined ? store.get('lastPath') : {};
const ens = network.type.ensResolver == null;

const state = {
  account: {
    balance: 0
  },
  customPaths: customPaths,
  ens: ens,
  Errors: {},
  ethDonationAddress: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
  gasPrice: gasPrice,
  Networks: nodeList,
  network: network,
  notifications: notifications,
  path: lastPath,
  online: true,
  Transactions: {},
  wallet: null,
  web3: {}
};

export default state;
