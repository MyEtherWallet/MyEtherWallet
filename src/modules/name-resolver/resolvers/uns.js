import Resolution from '@unstoppabledomains/resolution';
import { toChecksumAddress } from 'web3-utils';
export default class UNS {
  constructor() {
    const mainnet = {
      network: 'mainnet',
      url: 'https://nodes.mewapi.io/rpc/eth'
    };

    const polygon = {
      network: 'polygon-mainnet',
      url: 'https://nodes.mewapi.io/rpc/matic'
    };
    const resolution = new Resolution({
      sourceConfig: {
        uns: {
          locations: {
            Layer1: mainnet,
            Layer2: polygon
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

  resolveAddress(address) {
    return this.reverseUrl(address);
  }

  reverseUrl(address) {
    return this.resolver.reverse(address).then(domain => domain);
  }
}
