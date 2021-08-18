import BigNumber from 'bignumber.js';
import { toBN, toWei } from 'web3-utils';
const MED_CONST = 21428571428.571;
const MED_MULTIPLIER = 1.0714285714286;
const FAST_CONST = 42857142857.145;
const FAST_MULTIPLIER = 1.1428571428571;
const OLD_MED_CONST = 1.25;
const OLD_FAST_CONST = 1.5;
const LIMITER = 25000000000;

const getEconomy = gasPrice => {
  return BigNumber(gasPrice).toFixed(0);
};
const getRegular = gasPrice => {
  if (gasPrice > LIMITER) {
    let initialValue = BigNumber(gasPrice).times(MED_MULTIPLIER);
    initialValue = initialValue.plus(MED_CONST);
    return BigNumber(initialValue).toFixed(0);
  }
  return BigNumber(gasPrice).times(1.25).toFixed(0);
};
const getFast = gasPrice => {
  if (gasPrice > LIMITER) {
    let initialValue = BigNumber(gasPrice).times(FAST_MULTIPLIER);
    initialValue = initialValue.plus(FAST_CONST);

    return BigNumber(initialValue).toFixed(0);
  }
  return BigNumber(gasPrice).times(1.5).toFixed(0);
};
const fastToEconomy = gasPrice => {
  const oldConverted = gasPrice / OLD_FAST_CONST;
  if (LIMITER > oldConverted) {
    return oldConverted;
  }
  let initialValue = BigNumber(gasPrice).minus(FAST_CONST);
  initialValue = initialValue.div(FAST_MULTIPLIER);
  return BigNumber(initialValue).toFixed(0);
};

const regularToEconomy = gasPrice => {
  const oldConverted = gasPrice / OLD_MED_CONST;
  if (LIMITER > oldConverted) {
    return oldConverted;
  }
  let initialValue = BigNumber(gasPrice).minus(MED_CONST);
  initialValue = initialValue.div(MED_MULTIPLIER);
  return BigNumber(initialValue).toFixed(0);
};
const gasPriceTypes = {
  ECONOMY: 'economy',
  REGULAR: 'regular',
  FAST: 'fast'
};
const estimatedTime = type => {
  switch (type) {
    case gasPriceTypes.ECONOMY:
      return '15 min';
    case gasPriceTypes.REGULAR:
      return '5 min';
    case gasPriceTypes.FAST:
      return '2 min';
    default:
      return '';
  }
};
const getGasBasedOnType = (gasPrice, gasPriceType) => {
  switch (gasPriceType) {
    case gasPriceTypes.ECONOMY:
      return getEconomy(gasPrice);
    case gasPriceTypes.REGULAR:
      return getRegular(gasPrice);
    case gasPriceTypes.FAST:
      return getFast(gasPrice);
    default:
      return getEconomy(gasPrice);
  }
};
const getPriorityFeeBasedOnType = (priorityFeeBN, gasPriceType) => {
  const minFee = toBN(toWei('2', 'gwei'));
  switch (gasPriceType) {
    case gasPriceTypes.ECONOMY:
      return minFee;
    case gasPriceTypes.REGULAR:
      return priorityFeeBN.muln(0.5).lt(minFee.muln(2))
        ? minFee.muln(2)
        : priorityFeeBN.muln(0.5);
    case gasPriceTypes.FAST:
      return priorityFeeBN.lt(minFee.muln(4)) ? minFee.muln(4) : priorityFeeBN;
    default:
      return minFee;
  }
};
export {
  getEconomy,
  getRegular,
  getFast,
  getGasBasedOnType,
  fastToEconomy,
  regularToEconomy,
  gasPriceTypes,
  getPriorityFeeBasedOnType,
  estimatedTime
};
