import ens from '@ensdomains/ensjs';

export default class ENS {
  constructor(network, web3) {
    this.resolver = new ens({
      provider: web3.currentProvider,
      ensAddress: network.type.ens.registry
    });
  }
  resolveName(name) {
    return this.resolver.name(name).getAddress();
  }
}
