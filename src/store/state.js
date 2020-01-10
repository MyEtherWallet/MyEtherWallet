import nodeList from '@/networks';
import darklist from '@/address-darklist/address-darklist.json';
import store from 'store';
import { MEW_CX } from '@/builds/configs/types';
if (store.get('notifications') === undefined) store.set('notifications', {});
const gettingStartedDone =
  store.get('skipTutorial') !== undefined ? store.get('skipTutorial') : false;
const storedNetwork = store.get('network');
let network = BUILD_TYPE !== MEW_CX ? nodeList['ETH'][0] : nodeList['ETH'][1];
if (BUILD_TYPE !== MEW_CX && storedNetwork !== undefined) {
  network = storedNetwork;
  if (storedNetwork.type.name !== 'CUS') {
    network = storedNetwork;
    network.type = nodeList[storedNetwork.type.name][0].type;
    nodeList[storedNetwork.type.name].forEach(node => {
      if (storedNetwork.service === node.service) {
        network = node;
      }
    });
  }
}

const addressBook =
  store.get('addressBook') !== undefined ? store.get('addressBook') : [];
const notifications =
  store.get('notifications') !== undefined ? store.get('notifications') : {};
const gasPrice =
  store.get('gasPrice') !== undefined ? store.get('gasPrice') : 41;
const customPaths =
  store.get('customPaths') !== undefined ? store.get('customPaths') : {};
const state = {
  account: {
    balance: 0,
    address: null,
    isHardware: false,
    identifier: '',
    nickname: ''
  },
  customPaths: customPaths,
  ens: null,
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
  darklist: darklist,
  gettingStartedDone: gettingStartedDone,
  blockNumber: 0,
  linkQuery: {},
  addressBook: addressBook,
  locale: store.get('locale') !== undefined ? store.get('locale') : 'en_US'
};

export default state;
