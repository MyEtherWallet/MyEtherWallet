import web3 from 'web3';
import store from '@/core/store';
import { ROOTSTOCK } from '@/utils/networks/types';
import {
  toChecksumAddress as toChecksumAddr,
  isValidChecksumAddress
} from 'ethereumjs-util';

const isAddress = address => {
  const chainId = store.getters['global/network'].type.chainID;

  if (chainId === ROOTSTOCK.chainID) {
    // check if it has the basic requirements of an address
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      return false;
      // If it's ALL lowercase or ALL upppercase
    } else if (
      /^(0x|0X)?[0-9a-f]{40}$/.test(address) ||
      /^(0x|0X)?[0-9A-F]{40}$/.test(address)
    ) {
      return true;
      // Otherwise check each case
    }

    return isValidChecksumAddress(address, chainId);
  }

  return (
    address && web3.utils.isHexStrict(address) && web3.utils.isAddress(address)
  );
};
const toChecksumAddress = address => {
  const chainId = store.getters['global/network'].type.chainID;
  // Use EIP-1191 Address Checksum if its Rootstock network
  if (chainId === ROOTSTOCK.chainID) {
    return toChecksumAddr(address, chainId);
  }

  return web3.utils.toChecksumAddress(address);
};
export { isAddress, toChecksumAddress };
