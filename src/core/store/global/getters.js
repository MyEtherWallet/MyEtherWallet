import nodeList from '@/utils/networks';
import { ETH, BSC, MATIC } from '@/utils/networks/types';
import {
  getGasBasedOnType,
  getPriorityFeeBasedOnType,
  getBaseFeeBasedOnType,
  gasPriceTypes
} from '@/core/helpers/gasPriceHelper';
import { toBN } from 'web3-utils';

const Networks = function () {
  return nodeList;
};
const network = function (state) {
  let network = nodeList['ETH'][0];
  if (!nodeList[state.currentNetwork.type.name]) {
    throw new Error('Current network is not in nodeList.');
  }
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
  const baseFee = getBaseFeeBasedOnType(
    toBN(state.eip1559.baseFeePerGas),
    type
  );
  return baseFee.add(priorityFee).toString();
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

const isEIP1559SupportedNetwork = function (state) {
  return state.eip1559.baseFeePerGas !== '0';
};
const gasFeeMarketInfo = function (state) {
  const priorityFee = getPriorityFeeBasedOnType(
    toBN(state.eip1559.maxPriorityFeePerGas),
    state.gasPriceType
  );
  const maxPriorityFeePerGas = getPriorityFeeBasedOnType(
    toBN(state.eip1559.maxPriorityFeePerGas),
    gasPriceTypes.FAST
  );
  const baseFee = getBaseFeeBasedOnType(
    toBN(state.eip1559.baseFeePerGas),
    state.gasPriceType
  );
  return {
    baseFeePerGas: baseFee,
    maxFeePerGas: baseFee.add(priorityFee),
    priorityFeePerGas: priorityFee,
    maxPriorityFeePerGas
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
  isEIP1559SupportedNetwork,
  gasFeeMarketInfo,
  gasPriceByType
};
