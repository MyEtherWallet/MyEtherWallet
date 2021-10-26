import Configs from '../configs';
import { toWei } from 'web3-utils';
import nodeList from '@/utils/networks';
import { gasPriceTypes } from '@/core/helpers/gasPriceHelper';
const defaultNetwork = nodeList['ETH'].find(item => {
  return item.service === 'myetherwallet.com-ws';
});

const state = {
  localStore: true,
  consentToTrack: false,
  displayedTrackingPopup: false,
  Errors: {},
  online: true,
  linkQuery: {},
  locale: 'en_US',
  stateVersion: Configs.VERSION.global,
  gasLimitWarning: 100,
  baseGasPrice: toWei('41', 'gwei'),
  gasPriceType: gasPriceTypes.ECONOMY,
  currentNetwork: defaultNetwork
    ? Object.assign({}, defaultNetwork)
    : Object.assign({}, nodeList['ETH'][0]),
  preferredCurrency: 'USD',
  customPaths: [],
  localContracts: {},
  eip1559: {
    baseFeePerGas: '0',
    maxPriorityFeePerGas: '0'
  },
  showedBanner: false
};
state.currentNetwork.type = {
  name: state.currentNetwork.type.name
};

export default state;
