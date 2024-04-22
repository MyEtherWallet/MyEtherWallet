import { fromWei } from 'web3-utils';
import BigNumber from 'bignumber.js';

import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { toBNSafe } from '@/core/helpers/numberFormatHelper';

const getPoolSupply = function (state) {
  return fromWei(toBNSafe(state.poolSupply));
};

const getStakingFee = function (state) {
  return formatFloatingPointValue(BigNumber(state.stakingFee).div(100)).value;
};
export default { getPoolSupply, getStakingFee };
