import ENS from './resolvers/ens';
import UNS from './resolvers/uns';
import { normalise } from './helpers';
import { isAddress } from '@/core/helpers/addressUtils.js';
export default class NameResolver {
  constructor(network, web3) {
    this.network = network;
    this.web3 = web3;
    this.ens = new ENS(this.network, this.web3);
    this.uns = new UNS(this.network, this.web3);
  }
  isValidName(name) {
    const splitName = name.split('.');
    if (splitName.length > 1) {
      name = normalise(name);
      return name.indexOf('.') > 0;
    }
    return true;
  }
  async resolveName(name) {
    name = normalise(name);
    let address = '';
    const ensAddress = await this.ens.resolveName(name);
    if (ensAddress === '0x0000000000000000000000000000000000000000') {
      address = await this.uns.resolveName(name);
    } else {
      address = ensAddress;
    }

    if (isAddress(address)) {
      return address;
    }
    throw new Error('Invalid Address!');
  }
}
