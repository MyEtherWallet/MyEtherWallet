export default class NameModuleInterface {
  constructor(name, address, network, web3) {
    this.name = name;
    this.address = address;
    this.network = network;
    this.web3 = web3;
    this.data = {};

    return this.data;
  }

  //
}
