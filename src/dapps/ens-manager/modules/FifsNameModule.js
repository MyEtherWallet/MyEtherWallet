import ENSManagerInterface from './ENSManagerInterface.js';

export default class FifsNameModule extends ENSManagerInterface {
  constructor(name, address, network, web3, ens, gasPrice) {
    super(name, address, network, web3, ens, gasPrice);
  }

  async register() {
    const data = await this.registrarContract.methods
      .register(this.labelHash, this.address)
      .encodeABI();

    const registerTx = {
      from: this.address,
      value: 0,
      to: this.registrarAddress,
      data: data
    };

    const setResolverTx = {
      from: this.address,
      to: this.network.type.ens.registry,
      data: this.registryContract.methods
        .setResolver(this.nameHash, this.publicResolverAddress)
        .encodeABI(),
      value: 0,
      gasPrice: this.gasPrice
    };
    return this.web3.mew.sendBatchTransactions(
      [registerTx, setResolverTx].filter(Boolean)
    );
  }

  transfer(toAddress) {
    return this.web3.eth.sendTransaction({
      from: this.address,
      to: toAddress,
      data: this.registryContract.methods
        .setOwner(this.nameHash, toAddress)
        .encodeABI(),
      value: 0
    });
  }
}
