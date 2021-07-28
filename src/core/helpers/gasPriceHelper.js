import BigNumber from 'bignumber.js';
import { toBN } from 'web3-utils';

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
  switch (gasPriceType) {
    case gasPriceTypes.ECONOMY:
      return toBN('0');
    case gasPriceTypes.REGULAR:
      return priorityFeeBN.muln(0.5);
    case gasPriceTypes.FAST:
      return priorityFeeBN;
    default:
      return toBN('0');
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
  getPriorityFeeBasedOnType
};
