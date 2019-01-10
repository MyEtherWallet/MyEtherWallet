import { isValidChecksumAddress as isValidChecksumRSKAddress } from 'rskjs-util';
import web3 from 'web3';

export default function isValidAddress(address, chainId) {
  if (chainId === 30 || chainId === 31) {
    return isValidRSKAddress(address, chainId);
  }
  return web3.utils.isAddress(address);
}

function isValidRSKAddress(address, chainId) {
  if (address === '0x0000000000000000000000000000000000000000') {
    return false;
  }
  if (address.substring(0, 2) !== '0x') {
    return false;
  } else if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    return false;
  } else if (
    /^(0x)?[0-9a-f]{40}$/.test(address) ||
    /^(0x)?[0-9A-F]{40}$/.test(address)
  ) {
    return true;
  }
  return isValidChecksumRSKAddress(address, chainId);
}
