import Resolution from '@unstoppabledomains/resolution';
import { toChecksumAddress } from 'web3-utils';
import Web3 from 'web3';
export default class UNS {
  constructor(network, web3) {
    const networkname = 'mainnet';
    const polyname = 'polygon-mainnet';
    const polyprovider = new Web3('wss://nodes.mewapi.io/ws/matic');
    const resolution = new Resolution({
      sourceConfig: {
        uns: {
          locations: {
            Layer1: {
              network: networkname,
              url: web3.currentProvider.host
            },
            Layer2: {
              network: polyname,
              url: polyprovider.currentProvider.host
            }
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
