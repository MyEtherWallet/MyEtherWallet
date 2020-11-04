import BigNumber from 'bignumber.js';
import store from 'store';
// import web3Utils from 'web3-utils';

const MED_CONST = 21428571428.571;
const MED_MULTIPLIER = 1.0714285714286;
const FAST_CONST = 42857142857.145;
const FAST_MULTIPLIER = 1.1428571428571;
const OLD_MED_CONST = 1.25;
const OLD_FAST_CONST = 1.5;
const LIMITER = 25000000000;

// const toGwei = gasPrice => {
//   return web3Utils.fromWei(BigNumber(gasPrice).toString(), 'gwei');
// };

// const toWei = gasPrice => {
//   return web3Utils.toWei(BigNumber(gasPrice).toString(), 'gwei');
// };

const getEconomy = gasPrice => {
  return BigNumber(gasPrice).div(1).toFixed();
};
const getRegular = gasPrice => {
  if (gasPrice > LIMITER) {
    let initialValue = BigNumber(gasPrice).times(MED_MULTIPLIER);
    initialValue = initialValue.plus(MED_CONST);

    return BigNumber(initialValue).toFixed();
  }

  return BigNumber(gasPrice).times(1.25).toFixed();
};
const getFast = gasPrice => {
  if (gasPrice > LIMITER) {
    let initialValue = BigNumber(gasPrice).times(FAST_MULTIPLIER);
    initialValue = initialValue.plus(FAST_CONST);

    return BigNumber(initialValue).toFixed();
  }

  return BigNumber(gasPrice).times(1.5).toFixed();
};

const getOther = () => {
  const storedPrice = store.get('customGasPrice') || 0;
  return BigNumber(storedPrice).toFixed();
};

const fastToEconomy = gasPrice => {
  const oldConverted = gasPrice / OLD_FAST_CONST;
  if (LIMITER > oldConverted) {
    return oldConverted;
  }
  let initialValue = BigNumber(gasPrice).minus(FAST_CONST);
  initialValue = initialValue.div(FAST_MULTIPLIER);
  return BigNumber(initialValue).toFixed();
};

const regularToEconomy = gasPrice => {
  const oldConverted = gasPrice / OLD_MED_CONST;
  if (LIMITER > oldConverted) {
    return oldConverted;
  }
  let initialValue = BigNumber(gasPrice).minus(MED_CONST);
  initialValue = initialValue.div(MED_MULTIPLIER);
  return BigNumber(initialValue).toFixed();
};

const getGasBasedOnType = gasPrice => {
  const gasPriceType = store.get('gasPriceType') || 'economy';
  switch (gasPriceType) {
    case 'economy':
      return getEconomy(gasPrice);
    case 'regular':
      return getRegular(gasPrice);
    case 'fast':
      return getFast(gasPrice);
    default:
      return getOther();
  }
};

export {
  getEconomy,
  getRegular,
  getFast,
  getOther,
  getGasBasedOnType,
  fastToEconomy,
  regularToEconomy
};
