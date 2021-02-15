import { fromWei } from 'web3-utils';
const balanceInETH = function (state) {
  return fromWei(state.balance);
};

const totalOwnedDomains = function (state) {
  return state.ensDomains ? state.ensDomains.length : 0;
};

export default {
  balanceInETH,
  totalOwnedDomains
};
