import web3 from 'web3';

const isAddress = address => {
  return address && web3.utils.isAddress(address);
};
const toChecksumAddress = address => {
  return web3.utils.toChecksumAddress(address);
};
export { isAddress, toChecksumAddress };
