import nodeList from '@/networks';
import darklist from '@/darklist/address-darklist.json';
import store from 'store';
if (store.get('notifications') === undefined) store.set('notifications', {});

const network =
  store.get('network') !== undefined
    ? store.get('network')
    : nodeList['ETH'][0];
const notifications =
  store.get('notifications') !== undefined ? store.get('notifications') : {};
const gasPrice =
  store.get('gasPrice') !== undefined ? store.get('gasPrice') : 41;

const customPaths =
  store.get('customPaths') !== undefined ? store.get('customPaths') : {};
const ens = network.type.ensResolver == null;
store.set('network', network);
const state = {
  account: {
    balance: 0,
    address: null,
    isHardware: false,
    identifier: ''
  },
  customPaths: customPaths,
  ens: ens,
  Errors: {},
  ethDonationAddress: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
  gasPrice: gasPrice,
  Networks: nodeList,
  network: network,
  notifications: notifications,
  path: '',
  online: true,
  transactions: {},
  wallet: null,
  web3: {},
  sidemenuOpen: false,
  darklist: darklist
};

export default state;
