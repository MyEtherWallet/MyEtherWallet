import { fromWei } from 'web3-utils';
const balanceInETH = function (state) {
  return fromWei(state.balance);
};
export default {
  balanceInETH
};
