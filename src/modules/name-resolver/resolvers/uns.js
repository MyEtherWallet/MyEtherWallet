import Resolution from '@unstoppabledomains/resolution';
import { toChecksumAddress } from 'web3-utils';

export default class UNS {
  constructor(network) {
    const resolution = new Resolution({
      blockchain: {
        ens: false,
        uns: {
          url: network.url,
          network: 'mainnet' //we have to get this from network object
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
