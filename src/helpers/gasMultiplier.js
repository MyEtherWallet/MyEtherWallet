import BigNumber from 'bignumber.js';
import store from 'store';
const MED_CONST = 21.428571428571;
const MED_MULTIPLIER = 1.0714285714286;
const FAST_CONST = 42.857142857145;
const FAST_MULTIPLIER = 1.1428571428571;

const getEconomy = gasPrice => {
  return new BigNumber(gasPrice).div(1).toFixed(0);
};
const getRegular = gasPrice => {
  let initialValue = new BigNumber(gasPrice).times(MED_MULTIPLIER);
  initialValue = initialValue.plus(MED_CONST).toFixed(0);

  return new BigNumber(initialValue).toFixed();
};
const getFast = gasPrice => {
  let initialValue = new BigNumber(gasPrice).times(FAST_MULTIPLIER);
  initialValue = initialValue.plus(FAST_CONST).toFixed(0);

  return new BigNumber(initialValue).toFixed();
};

const getGasBasedOnType = gasPrice => {
  const gasPriceType = store.get('gasPriceType') || 'economy';
  const storedPrice = store.get('gasPrice') || 0;
  switch (gasPriceType) {
    case 'economy':
      return getEconomy(gasPrice);
    case 'regular':
      return getRegular(gasPrice);
    case 'fast':
      return getFast(gasPrice);
    default:
      return storedPrice;
  }
};

export { getEconomy, getRegular, getFast, getGasBasedOnType };
