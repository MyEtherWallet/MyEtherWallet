import nodeList from '@/utils/networks';
import { ETH } from '@/utils/networks/types';
import { getGasBasedOnType } from '@/core/helpers/gasPriceHelper';

const Networks = function () {
  return nodeList;
};
const network = function (state) {
  let network = nodeList['ETH'][0];
  if (state.currentNetwork.type.name !== 'CUS') {
    const iteratableArr = nodeList[state.currentNetwork.type.name];
    network = state.currentNetwork;
    network.type = nodeList[state.currentNetwork.type.name][0].type;
    for (let index = 0; index < iteratableArr.length; index++) {
      if (state.currentNetwork.service === iteratableArr[index].service) {
        network = iteratableArr[index];
        break;
      }
    }
  }
  return network;
};

const gasPrice = function (state) {
  const stateCopy = JSON.parse(JSON.stringify(Object.assign({}, state)));
  return getGasBasedOnType(stateCopy.baseGasPrice, stateCopy.gasPriceType);
};

const isEthNetwork = function (state) {
  return state.currentNetwork.type.name === ETH.name;
};

const localContracts = function (state) {
  return state.localContracts[state.currentNetwork.type.name]
    ? state.localContracts[state.currentNetwork.type.name]
    : [];
};

export default {
  Networks,
  network,
  gasPrice,
  isEthNetwork,
  localContracts
};
