import { toBN } from 'web3-utils';

const numberIsInteger = _num => {
  try {
    toBN(_num);
    return true;
  } catch (e) {
    return false;
  }
};

const validBlockNumber = _num => {
  try {
    const block = toBN(_num);
    return !block.isNeg();
  } catch (e) {
    return false;
  }
};

export { numberIsInteger, validBlockNumber };
