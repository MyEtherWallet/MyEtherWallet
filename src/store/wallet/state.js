import nodeList from '@/utils/networks';
import store from 'store';
const storedNetwork = store.get('network');
let network = nodeList['ETH'][0];
if (storedNetwork && storedNetwork.type.name !== 'CUS') {
  const iteratableArr = nodeList[storedNetwork.type.name];
  network = storedNetwork;
  network.type = nodeList[storedNetwork.type.name][0].type;
  for (let index = 0; index < iteratableArr.length; index++) {
    if (storedNetwork.service === iteratableArr[index].service) {
      network = iteratableArr[index];
      break;
    }
  }
} else {
  network = storedNetwork ? storedNetwork : nodeList['ETH'][0];
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
  address: null,
  addressBook: addressBook,
  balance: '0',
  blockNumber: 0,
  customPaths: customPaths,
  ens: null,
  gasLimitWarning: 100,
  gasPrice: gasPrice,
  identifier: '',
  isHardware: false,
  network: network,
  nickname: '',
  notifications: notifications,
  transactions: {},
  usd: 0,
  instance: null,
  web3: {}
};

export default state;
