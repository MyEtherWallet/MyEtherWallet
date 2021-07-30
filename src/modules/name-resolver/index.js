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
    name = normalise(name);
    return name.indexOf('.') > 0;
  }
  resolveName(name) {
    name = normalise(name);
    if (/^[a-zA-Z\-.0-9]*\.(crypto|zil)$/.test(name))
      return this.uns.resolveName(name);
    return this.ens.resolveName(name);
  }
}
