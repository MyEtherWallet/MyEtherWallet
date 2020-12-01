import store from '@/store';

import {
  isValidChecksumAddress as isValidRSKChecksumAddress,
  toChecksumAddress as toRSKChecksumAddress
} from 'rskjs-util';
import web3 from 'web3';

const isAddress = address => {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    return false;
  } else if (
    /^(0x|0X)?[0-9a-f]{40}$/.test(address) ||
    /^(0x|0X)?[0-9A-F]{40}$/.test(address)
  ) {
    return true;
  }
  const chainID = store.state.wallet.network
    ? store.state.wallet.network.type.chainID
    : 1;
  if (chainID === 4 || chainID === 31)
    return isValidRSKChecksumAddress(address, chainID);
  return web3.utils.checkAddressChecksum(address);
};
const toChecksumAddress = address => {
  const chainID = store.state.wallet.network
    ? store.state.wallet.network.type.chainID
    : 1;
  if (chainID === 4 || chainID === 31)
    return toRSKChecksumAddress(address, chainID);
  return web3.utils.toChecksumAddress(address);
};
export { isAddress, toChecksumAddress };
