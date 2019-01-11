import { toChecksumAddress as toRSKChecksumAddress } from 'rskjs-util';
import web3 from 'web3';

export default function getChecksumAddressByChainId(address, chainId) {
  if (chainId === 30 || chainId === 31) {
    return toRSKChecksumAddress(address, chainId);
  }

  return web3.utils.toChecksumAddress(address);
}
