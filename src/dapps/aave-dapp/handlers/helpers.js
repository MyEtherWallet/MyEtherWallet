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
  AAVE_TABLE_HEADER,
  ACTION_TYPES,
  INTEREST_TYPES
};
