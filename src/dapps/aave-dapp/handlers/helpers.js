import web3Util from 'web3-utils';
import BigNumber from 'bignumber.js';
const checkAmount = (total, amount) => {
  if (web3Util.BN(amount).gt(web3Util.BN(total))) {
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

export default {
  checkAmount,
  findReserve,
  convertToFixed
};
