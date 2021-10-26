import ENS from './resolvers/ens';
import CNS from './resolvers/cns';
import { normalise } from './helpers';
export default class NameResolver {
  constructor(network) {
    this.network = network;
    this.ens = new ENS(this.network);
    this.cns = new CNS(this.network);
  }
  isValidName(name) {
    name = normalise(name);
    return name.indexOf('.') > 0;
  }
  resolveName(name) {
    name = normalise(name);
    if (/^[a-zA-Z\-.0-9]*\.(crypto|zil)$/.test(name))
      return this.cns.resolveName(name);
    return this.ens.resolveName(name);
  }
}
