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
  async resolveName(name) {
    name = normalise(name);
    let address = '';
    if (/^[a-zA-Z\-.0-9]*\.(crypto|zil)$/.test(name))
      address = await this.uns.resolveName(name);
    address = await this.ens.resolveName(name);
    if (address === '0x0000000000000000000000000000000000000000')
      throw new Error('Invalid address');
    else return address;
  }
}
