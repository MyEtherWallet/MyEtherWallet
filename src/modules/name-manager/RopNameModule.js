import * as nameHashPckg from 'eth-ens-namehash';
import { getHostName } from './helpers';
import * as unit from 'ethjs-unit';
export default class RopNameModule {
  constructor(name, address, network, web3, ens) {
    this.address = address ? address : '0x';
    this.network = network ? network : null;
    this.web3 = web3 ? web3 : null;
    this.ens = ens ? ens : null;

    // returned values
    this.name = name;
    this.labelHash = web3.utils.sha3(getHostName(name));
    this.nameHash = nameHashPckg.hash(name);
    this.owner = '0x';
  }

  register() {
    const address = this.account.address;
    const web3 = this.web3;
    return new Promise((resolve, reject) => {
      this.registrarContract.methods
        .register(this.labelHash, address)
        .encodeABI()
        .then(data => {
          const registerTx = {
            from: address,
            value: 0,
            to: this.registrarAddress,
            data: data
          };
          const setResolverTx = {
            from: address,
            to: this.network.type.ens.registry,
            data: this.ensRegistryContract.methods
              .setResolver(this.nameHash, this.publicResolverAddress)
              .encodeABI(),
            value: 0,
            gasPrice: new BigNumber(unit.toWei(this.gasPrice, 'gwei')).toFixed()
          };
          web3.mew
            .sendBatchTransactions([registerTx, setResolverTx].filter(Boolean))
            .then(resolve)
            .catch(reject);
        });
    });
  }
}
