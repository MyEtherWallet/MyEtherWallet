import nodeList from '@/utils/networks';
import store from 'store';
const storedNetwork = store.get('network') || { type: {} };
let network = nodeList['ETH'][0];
if (storedNetwork.type.name !== 'CUS') {
  const iteratableArr = nodeList[storedNetwork.type.name || 'ETH'];
  network = storedNetwork;
  console.log('may need to remove to ETH fallbacks || ETH here'); // todo remove dev item
  network.type = nodeList[storedNetwork.type.name || 'ETH'][0].type;
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
  blockNumber: 0,
  linkQuery: {},
  addressBook: addressBook,
  locale: store.get('locale') !== undefined ? store.get('locale') : 'en_US',
  gasLimitWarning: 100
};

export default state;
