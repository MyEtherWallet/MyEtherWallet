import Resolution from '@unstoppabledomains/resolution';
import { toChecksumAddress } from 'web3-utils';
import Web3 from 'web3';
export default class UNS {
  constructor(network, web3) {
    const networkname = 'mainnet';
    const polyname = 'polygon-mainnet';
    const polyprovider = new Web3('https://nodes.mewapi.io/rpc/matic');
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
    // return this.reverseTokenId(address);
  }

  reverseTokenId(address) {
    return (
      this.resolver
        .reverseTokenId(address)
        .then(tokenId => console.log(address, 'reversed to', tokenId))
        // tokenId consists the namehash of the domain with reverse resolution to that address
        .catch(console.error)
    );
  }

  reverseUrl(address) {
    return (
      this.resolver
        .reverse(address)
        .then(domain => console.log(address, 'reversed to url', domain))
        // domain consists of the domain with reverse resolution to that address
        // use this domain in your application
        .catch(console.error)
    );
  }
}
