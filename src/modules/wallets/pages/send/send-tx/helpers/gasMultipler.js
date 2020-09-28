import BigNumber from 'bignumber.js';
import store from 'store';
const MED_CONST = 21.428571428571;
const MED_MULTIPLIER = 1.0714285714286;
const FAST_CONST = 42.857142857145;
const FAST_MULTIPLIER = 1.1428571428571;
const types = ['economy', 'regular', 'fast'];

const getEconomy = gasPrice => {
  return new BigNumber(gasPrice).div(1).toFixed(0);
};

const getRegular = gasPrice => {
  let value = new BigNumber(gasPrice).times(MED_MULTIPLIER);
  value = value.plus(MED_CONST).toFixed(0);

  return new BigNumber(value).toFixed();
};

const getFast = gasPrice => {
  let value = new BigNumber(gasPrice).times(FAST_MULTIPLIER);
  value = value.plus(FAST_CONST).toFixed(0);

  return new BigNumber(value).toFixed();
};

const getGasByType = gasPrice => {
  const type = store.get('type') || types[0];
  const storedPrice = store.get('gasPrice') || 0;
  switch (type) {
    case types[0]:
      return getEconomy(gasPrice);
    case types[1]:
      return getRegular(gasPrice);
    case types[2]:
      return getFast(gasPrice);
    default:
      return storedPrice;
  }
};

export { getEconomy, getRegular, getFast, getGasByType };
