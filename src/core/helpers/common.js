import { toBN } from 'web3-utils';
const isInt = num => {
  try {
    toBN(num);
    return true;
  } catch (e) {
    return false;
  }
};
const stringToArray = str => {
  return str.replace(/[^a-zA-Z0-9_,]+/g, '').split(',');
};
export { isInt, stringToArray };
