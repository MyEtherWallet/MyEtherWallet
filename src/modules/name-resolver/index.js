import ENS from './resolvers/ens';
import UNS from './resolvers/uns';
import { normalise } from './helpers';
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
  resolveName(name, ens = true) {
    name = normalise(name);
    if (ens) {
      return this.ens.resolveName(name);
    }
    return this.uns.resolveName(name);
  }
}
