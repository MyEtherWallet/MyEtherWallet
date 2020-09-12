import NameManagerInterface from './interface/NameManagerInterface';

export default class FifsNameModule extends NameManagerInterface {
  constructor(name, address, network, web3, ens) {
    super(name, address, network, web3, ens);
  }

  register() {
    const address = this.addressVal;
    const web3 = this.web3;
    const data = this.registrarContractVal.methods
      .register(this.labelHashVal, address)
      .encodeABI();
    const registerTx = {
      from: address,
      value: 0,
      to: this.registrarAddressVal,
      data: data
    };
    const setResolverTx = {
      from: address,
      to: this.networkVal.type.ens.registry,
      data: this.ensRegistryContractVal.methods
        .setResolver(this.nameHashVal, this.publicResolverAddressVal)
        .encodeABI(),
      value: 0
    };
    return web3.mew.sendBatchTransactions(
      [registerTx, setResolverTx].filter(Boolean)
    );
  }

  transfer(toAddress) {
    return this.web3.eth.sendTransaction({
      from: this.addressVal,
      to: toAddress,
      data: this.ensRegistryContractVal.methods
        .setOwner(this.nameHashVal, toAddress)
        .encodeABI(),
      value: 0
    });
  }
}
