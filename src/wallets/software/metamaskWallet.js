export default class MetamaskWallet {
  constructor(address) {
    this.address = address;
    this.type = 'Metamask';
    this.getAddress = this.getAddress.bind(this);
    this.getAddressString = this.getAddressString.bind(this);
  }

  getAddress() {
    return this.address;
  }

  getAddressString() {
    return this.address;
  }
}
