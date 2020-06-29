import Resolution from '@unstoppabledomains/resolution';
import { toChecksumAddress } from 'web3-utils';

export default class CNS {
  constructor(network) {
    const resolution = new Resolution({
      blockchain: {
        ens: false,
        cns: {
          url: network.url,
          network: 'mainnet' //we have to get this from network object
        }
      }
    });
    this.resolver = resolution;
  }
  resolveName(name) {
    return this.resolver
      .addressOrThrow(name, 'ETH')
      .then(addr => toChecksumAddress(addr));
  }
}
