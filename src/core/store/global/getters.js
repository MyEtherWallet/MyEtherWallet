import nodeList from '@/utils/networks';
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
  return getGasBasedOnType(state.baseGasPrice, state.gasPriceType);
};

export default {
  Networks,
  network,
  gasPrice
};
