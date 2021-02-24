import { isHexStrict } from 'web3-utils';

const validateHexString = str => {
  if (str === '') return true;
  return isHexStrict(str);
};

export default validateHexString;
