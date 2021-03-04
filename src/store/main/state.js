import nodeList from '@/networks';
import darklist from '@/_generated/address-darklist/address-darklist.json';
import store from 'store';
import { MEW_CX } from '@/builds/configs/types';
if (store.get('notifications') === undefined) store.set('notifications', {});
const gettingStartedDone =
  store.get('skipTutorial') !== undefined ? store.get('skipTutorial') : false;
const storedNetwork = store.get('network');
let network = nodeList['ETH'][0];
if (BUILD_TYPE !== MEW_CX && storedNetwork !== undefined) {
  network = storedNetwork;
  if (storedNetwork.type.name !== 'CUS') {
    const iteratableArr = nodeList[storedNetwork.type.name];
    network = storedNetwork;
    network.type = nodeList[storedNetwork.type.name][0].type;
    for (let index = 0; index < iteratableArr.length; index++) {
      if (storedNetwork.service === iteratableArr[index].service) {
        network = iteratableArr[index];
        break;
      }
    }
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
  locale: store.get('locale') !== undefined ? store.get('locale') : 'en_US',
  tempHide: false,
  gasLimitWarning: 250,
  ethGasPrice: 0
};

export default state;
