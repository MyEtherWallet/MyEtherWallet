import * as ethUtil from 'ethereumjs-util';

export default class MetamaskWallet {
  constructor(address) {
    this.address = address;
    this.type = 'metamask';
    this.getAddress = this.getAddress.bind(this);
    this.getAddressString = this.getAddressString.bind(this);
  }

  getAddress() {
    return this.address;
  }

  getAddressString() {
    return this.address;
  }

  signMessage(message, address) {
    const web3 = window.web3;
    const msg = ethUtil.bufferToHex(Buffer.from(message, 'utf8'));
    const params = [msg, address];
    const method = 'personal_sign';
    return new Promise(function(resolve, reject) {
      web3.currentProvider.sendAsync(
        {
          method,
          params,
          address
        },
        (err, res) => {
          if (err) {
            reject(err);
          }
          if (res.error) {
            reject(res.error);
          }

          const formattedRes = {
            address: address,
            msg: message,
            sig: res.result,
            version: '3',
            signer: 'metamask'
          };

          resolve(formattedRes);
        }
      );
    });
  }
}
