import Resolution from '@unstoppabledomains/resolution';
import { toChecksumAddress } from 'web3-utils';
import Web3 from 'web3';
export default class UNS {
  constructor(network, web3) {
    const networkname = 'mainnet';
    const polyname = 'polygon-mainnet';
    const polyprovider = new Web3('https://nodes.mewapi.io/rpc/matic');
    const resolution = Resolution.fromWeb3Version1Provider({
      ens: false,
      uns: {
        locations: {
          Layer1: {
            network: networkname,
            provider: web3.currentProvider
          },
          Layer2: {
            network: polyname,
            provider: polyprovider.currentProvider
          }
        }
      }
    });
    this.resolver = resolution;
  }
  resolveName(name) {
    return this.resolver
      .addr(name, 'ETH')
      .then(addr => toChecksumAddress(addr));
  }
}
