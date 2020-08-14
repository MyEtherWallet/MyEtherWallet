export default class FifsNameModule extends NameManagerInterface {
  constructor(name, address, network, web3, ens) {
    super(name, address, network, web3, ens);
  }

  register() {
    const address = super.addressVal;
    const web3 = super.web3;
    return new Promise((resolve, reject) => {
      super.registrarContractVal.methods
        .register(super.labelHashVal, address)
        .encodeABI()
        .then(data => {
          const registerTx = {
            from: address,
            value: 0,
            to: super.registrarAddressVal,
            data: data
          };
          const setResolverTx = {
            from: address,
            to: super.networkVal.type.ens.registry,
            data: super.ensRegistryContractVal.methods
              .setResolver(super.nameHashVal, super.publicResolverAddressVal)
              .encodeABI(),
            value: 0
          };
          web3.mew
            .sendBatchTransactions([registerTx, setResolverTx].filter(Boolean))
            .then(resolve)
            .catch(reject);
        });
    });
  }

  transfer(toAddress) {
    return new Promise((resolve, reject) => {
      super.web3.eth
        .sendTransaction({
          from: super.addressVal,
          to: toAddress,
          data: super.ensRegistryContractVal.methods
            .setOwner(super.nameHashVal, toAddress)
            .encodeABI(),
          value: 0
        })
        .then(resolve)
        .catch(reject);
    });
  }
}
