import Resolution from '@unstoppabledomains/resolution';
import { toChecksumAddress } from 'web3-utils';

export default class UNS {
  constructor(network, web3) {
    const networkname = 'mainnet';
    const resolution = Resolution.fromWeb3Version1Provider(
      web3.currentProvider,
      {
        ens: false,
        uns: {
          network: networkname
        }
      }
    );
    this.resolver = resolution;
  }
  resolveName(name) {
    return this.resolver
      .addr(name, 'ETH')
      .then(addr => toChecksumAddress(addr));
  }
}
