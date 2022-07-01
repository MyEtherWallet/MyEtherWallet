export default class ENSNameHandler {
  constructor(name, userAddress, network, web3, ens) {
    this.name = name;
    this.address = userAddress;
    this.network = network;
    this.web3 = web3;
    this.ensInstance = ens;
  }

  setController(address, returnObj = false) {
    const actualAddress = address ? address : this.address;
  }
}
