import nodeList from '@/utils/networks';
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
  console.log(network); // todo remove dev item
  return network;
};
export default {
  Networks,
  network
};
