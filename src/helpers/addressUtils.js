import store from '@/store';
import {
  isValidChecksumAddress as isValidRSKChecksumAddress,
  toChecksumAddress as toRSKChecksumAddress
} from 'rskjs-util';
import { RSK, RSKTEST } from '@/networks/types';
import { toChecksumAddress as web3ToChecksumAddress } from 'web3-utils';
const isAddress = address => {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    return false;
  } else if (
    /^(0x|0X)?[0-9a-f]{40}$/.test(address) ||
    /^(0x|0X)?[0-9A-F]{40}$/.test(address)
  ) {
    return true;
  }
  const chainID = store.state.network.type.chainID;
  if (chainID === RSK.chainID || chainID === RSKTEST.chainID)
    return isValidRSKChecksumAddress(address, chainID);
  return web3ToChecksumAddress(address);
};
const toChecksumAddress = address => {
  const chainID = store.state.network.type.chainID;
  if (chainID === RSK.chainID || chainID === RSKTEST.chainID)
    return toRSKChecksumAddress(address, chainID);
  return web3ToChecksumAddress(address);
};
export { isAddress, toChecksumAddress };
