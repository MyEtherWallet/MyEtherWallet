import BigNumber from 'bignumber.js';
import { createCurrency, createCurrencyRatio } from '@makerdao/currency';
import { RAY } from './constants';
const USD = createCurrency('USD');
const DAI = createCurrency('DAI');
// NOTE: When a function below has an argument with the same name as a function
// defined earlier in the file, that means it expects that argument's value to
// be the return value of a call to that earlier function.
//
// e.g. the fourth argument of `price`

// ilk math
const BnZero = new BigNumber(0);

export function debtCeiling(line) {
  return DAI.rad(line);
}

export function liquidationPenalty(chop) {
  return new BigNumber(chop.toString()).dividedBy(RAY).minus(1).toNumber();
}

export function liquidationRatio(mat) {
  const ratio = createCurrencyRatio(USD, DAI);
  return ratio(new BigNumber(mat.toString()).dividedBy(RAY).toString());
}

export function price(currency, par, spot, liquidationRatio) {
  par = new BigNumber(par.toString()).dividedBy(RAY);
  spot = new BigNumber(spot.toString()).dividedBy(RAY);
  const ratio = createCurrencyRatio(USD, currency);
  const price = spot.times(par).times(liquidationRatio.toNumber());
  return ratio(price);
}

const secondsPerYear = 60 * 60 * 24 * 365;

export function annualStabilityFee(duty) {
  duty = new BigNumber(duty.toString()).dividedBy(RAY);
  BigNumber.config({ POW_PRECISION: 100 });
  return duty.pow(secondsPerYear).minus(1).toNumber();
}

// cdp math

export function collateralAmount(currency, ink) {
  return currency.wei(ink);
}

export function collateralValue(collateralAmount, price) {
  return collateralAmount.times(price);
}

export function debtValue(art, rate) {
  art = DAI.wei(art);
  return art.times(rate).shiftedBy(-27);
}

export function collateralizationRatio(collateralValue, debtValue) {
  if (debtValue.eq(BnZero)) {
    const ratio = createCurrencyRatio(USD, DAI);
    return ratio(Infinity);
  }
  return collateralValue.div(debtValue._amount);
}

export function liquidationPrice(
  collateralAmount,
  debtValue,
  liquidationRatio
) {
  if (collateralAmount.eq(BnZero)) {
    const ratio = createCurrencyRatio(USD, collateralAmount.type);
    return ratio(Infinity);
  }
  return debtValue
    .times(liquidationRatio._amount)
    .div(collateralAmount._amount);
}

export function minSafeCollateralAmount(debtValue, liquidationRatio, price) {
  return debtValue.times(liquidationRatio).div(price);
}

export function daiAvailable(collateralValue, debtValue, liquidationRatio) {
  const maxSafeDebtValue = collateralValue.div(liquidationRatio);
  return debtValue.lt(maxSafeDebtValue)
    ? DAI(maxSafeDebtValue.minus(debtValue))
    : DAI(0);
}
