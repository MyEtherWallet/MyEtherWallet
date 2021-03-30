import { BN } from 'web3-utils';
import BigNumber from 'bignumber.js';
const checkAmount = (total, amount) => {
  if (BN(amount).gt(BN(total))) {
    return true;
  }
};

const findReserve = (id, reserves) => {
  return reserves.find(reserve => {
    return reserve.underlyingAsset
      ? reserve.underlyingAsset === id
      : reserve.reserve.underlyingAsset === id;
  });
};

const convertToFixed = (val, num) => {
  if (!val || val === 0) {
    return 0;
  }

  if (!num) {
    num = 2;
  }

  return new BigNumber(val).toFixed(num).toString();
};

/**
 * @param value - value to round, will be converted to BigNumber
 * @param round - number of decimal point to round to
 * @returns  a string of rounded number
 */
const getRoundNumber = (value, dp) => {
  return value.toFormat(Math.min(dp, value.decimalPlaces()));
};

const roundPercentage = val => {
  const value = new BigNumber(val.replace('%', ''));
  const isNegative = value.isNegative() ? '-' : '';
  const absoluteValue = value.absoluteValue(); // Get Absolute value
  /**
   *Case |value| >= 1000
   * Return: >1000 or <-1000
   */
  if (absoluteValue.isGreaterThanOrEqualTo(1000)) {
    return isNegative === '-' ? '<-1000%' : '>1000%';
  }

  /**
   * Case: |value| >= 100
   * Return: whole number
   */
  if (absoluteValue.isGreaterThanOrEqualTo(100)) {
    return `${value.toFormat(0)}%`;
  }

  /**
   * Case: |value| <= 100
   * Return: rounded to 2 decimal points number or no decimal points
   */
  return `${getRoundNumber(value, 2)}%`;
};

const roundNumber = val => {
  const OneThousand = 1e3;
  const OneMillion = 1e6;
  const OneBillion = 1e9;
  const OneTrillion = 1e12;
  const value = new BigNumber(val);

  /* Case I: value is 0 */
  if (value.isZero()) {
    return '0';
  }

  /* Case I: value >= 1,000,000,000,000 */
  if (value.isGreaterThanOrEqualTo(OneTrillion)) {
    return `${getRoundNumber(value.dividedBy(OneTrillion), 2)}T`;
  }

  /* Case II: value >= 1,000,000,000 */
  if (value.isGreaterThanOrEqualTo(OneBillion)) {
    return `${getRoundNumber(value.dividedBy(OneBillion), 2)}B`;
  }

  /* Case III: value >= 1,000,000*/
  if (value.isGreaterThanOrEqualTo(OneMillion)) {
    return `${getRoundNumber(value.dividedBy(OneMillion), 2)}M`;
  }

  /* Case IV: value >= 1,000*/
  if (value.isGreaterThanOrEqualTo(OneThousand)) {
    return value.toFormat(0);
  }

  /* Case V: value >= 1,000*/
  if (value.isGreaterThanOrEqualTo(1)) {
    return getRoundNumber(value, 2);
  }

  /**
   * Case VI: value >= 0.0001
   * Return: a number, rounded up to 4 decimal places
   */
  if (value.isGreaterThanOrEqualTo(0.0001)) {
    return getRoundNumber(value, 4);
  }
  return '<0.0001';
};

const AAVE_TABLE_HEADER = {
  DEPOSIT: 'DEPOSIT',
  BORROW: 'BORROW',
  BALANCE_DEPOSIT: 'BALANCE_DEPOSIT',
  BALANCE_BORROW: 'BALANCE_BORROW'
};

const ACTION_TYPES = {
  deposit: 'deposit',
  borrow: 'borrow',
  collateral: 'collateral',
  interest: 'interest',
  withdraw: 'withdraw',
  repay: 'repay',
  switch: 'switch'
};

const INTEREST_TYPES = {
  stable: 'stable',
  variable: 'variable'
};

export {
  checkAmount,
  findReserve,
  convertToFixed,
  roundPercentage,
  roundNumber,
  AAVE_TABLE_HEADER,
  ACTION_TYPES,
  INTEREST_TYPES
};
