import Configs from '../configs';
import { toWei } from 'web3-utils';
import nodeList from '@/utils/networks';

const state = {
  localStore: true,
  addressBook: [],
  Errors: {},
  path: '',
  online: true,
  linkQuery: {},
  locale: 'en_US',
  stateVersion: Configs.stateVersion,
  gasLimitWarning: 100,
  gasPrice: toWei('41', 'gwei'),
  currentNetwork: nodeList['ETH'][0],
  currency: {}
};
state.currentNetwork.type = {
  name: state.currentNetwork.type.name
};

export default state;
