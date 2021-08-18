import nodeList from '@/utils/networks';
import { ETH, BSC, MATIC } from '@/utils/networks/types';
import {
  getGasBasedOnType,
  getPriorityFeeBasedOnType
} from '@/core/helpers/gasPriceHelper';
import { toBN } from 'web3-utils';

const Networks = function () {
  return nodeList;
};
const network = function (state) {
  let network = nodeList['ETH'][0];
  const iteratableArr = nodeList[state.currentNetwork.type.name];
  network = Object.assign({}, state.currentNetwork);
  network.type = nodeList[state.currentNetwork.type.name][0].type;
  for (let index = 0; index < iteratableArr.length; index++) {
    if (state.currentNetwork.service === iteratableArr[index].service) {
      network = iteratableArr[index];
      break;
    }
  }
  return network;
};
const gasPriceByType = (state, getters) => type => {
  if (!getters.isEIP1559SupportedNetwork) {
    return getGasBasedOnType(state.baseGasPrice, type);
  }
  const priorityFee = getPriorityFeeBasedOnType(
    toBN(state.eip1559.maxPriorityFeePerGas),
    type
  );
  return toBN(state.eip1559.baseFeePerGas).add(priorityFee).toString();
};
const gasPrice = function (state, getters) {
  if (!getters.isEIP1559SupportedNetwork) {
    return getGasBasedOnType(state.baseGasPrice, state.gasPriceType);
  }
  return getters.gasFeeMarketInfo.maxFeePerGas.toString();
};

const isEthNetwork = function (state, getters) {
  return getters.network.type.name === ETH.name;
};
const isTestNetwork = function (state, getters) {
  return getters.network.type.isTestNetwork;
};

const localContracts = function (state, getters) {
  return state.localContracts[getters.network.type.name]
    ? state.localContracts[getters.network.type.name]
    : [];
};

const hasSwap = function (state, getters) {
  const name = getters.network.type.name;
  return name === ETH.name || name === BSC.name || name === MATIC.name;
};

const swapLink = function (state, getters, rootState) {
  const hasAddress = rootState.wallet.address;
  const link = 'https://ccswap.myetherwallet.com/#/';
  return hasAddress ? `${link}?to=${hasAddress}` : link;
};
const isEIP1559SupportedNetwork = function (state) {
  return state.eip1559.baseFeePerGas !== '0';
};
const gasFeeMarketInfo = function (state) {
  const priorityFee = getPriorityFeeBasedOnType(
    toBN(state.eip1559.maxPriorityFeePerGas),
    state.gasPriceType
  );
  return {
    baseFeePerGas: toBN(state.eip1559.baseFeePerGas),
    maxFeePerGas: toBN(state.eip1559.baseFeePerGas).add(priorityFee),
    priorityFeePerGas: priorityFee
  };
};
export default {
  Networks,
  network,
  gasPrice,
  isEthNetwork,
  localContracts,
  isTestNetwork,
  hasSwap,
  swapLink,
  isEIP1559SupportedNetwork,
  gasFeeMarketInfo,
  gasPriceByType
};
