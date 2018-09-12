import Web3 from 'web3';
const web3 = new Web3(window.web3.currentProvider);

export default class MetamaskWallet {
  constructor(address) {
    this.address = address;
    this.type = 'Web3';
    this.getAddress = this.getAddress.bind(this);
    this.getAddressString = this.getAddressString.bind(this);
    this.signMessage = this._signMessage.bind(this);
  }

  getAddress() {
    return this.address;
  }

  getAddressString() {
    return this.address;
  }

  _signMessage(message) {
    const address = this.address;
    return new Promise((resolve, reject) => {
      web3.eth.sign(message, address, function(err, res) {
        if (!err) {
          resolve(res);
        }
        reject(err);
      });
      // .then(res => {
      //   resolve(res);
      // })
      // .error(err => {
      //   reject(err);
      // });
    });
  }
}
