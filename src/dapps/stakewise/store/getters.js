import { fromWei } from 'web3-utils';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import BigNumber from 'bignumber.js';

const getPoolSupply = function (state) {
  return fromWei(state.poolSupply);
};

const getStakingFee = function (state) {
  return formatFloatingPointValue(BigNumber(state.stakingFee).div(100)).value;
};
export default { getPoolSupply, getStakingFee };
