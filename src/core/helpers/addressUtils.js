import web3 from 'web3';
import { validate } from 'bitcoin-address-validation';

const isAddress = address => {
  return (
    address && web3.utils.isHexStrict(address) && web3.utils.isAddress(address)
  );
};
const toChecksumAddress = address => {
  return web3.utils.toChecksumAddress(address);
};
const isBtcAddress = address => {
  return validate(address);
};
export { isAddress, isBtcAddress, toChecksumAddress };
