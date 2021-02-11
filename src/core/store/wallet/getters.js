import { fromWei } from 'web3-utils';
const balanceInETH = function (state) {
  return fromWei(state.balance);
};

const totalOwnedDomains = function (state) {
  return state.ensDomains ? state.ensDomains.length : 0;
};

const web3 = function (state) {
  return state.web3 ? state.web3 : null;
};

const address = function (state){
  return state.address
}

const isHardware = function(state){
  return state.isHardware
}

const identifier = function(state){
  return state.identifier
}
export default {
  balanceInETH,
  totalOwnedDomains,
  web3,
  address,
  isHardware,
  identifier
};
