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
  balance: 0,
  address: null,
  isHardware: false,
  identifier: '',
  nickname: '',
  customPaths: customPaths,
  ens: null,
  gasPrice: gasPrice,
  network: network,
  notifications: notifications,
  transactions: {},
  wallet: null,
  web3: {},
  blockNumber: 0,
  addressBook: addressBook,
  gasLimitWarning: 100,
  usd: 0
};

export default state;
