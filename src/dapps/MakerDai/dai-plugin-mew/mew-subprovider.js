import HookedWalletSubprovider from 'web3-provider-engine/dist/es5/subproviders/hooked-wallet';

export default function createLedgerSubprovider(web3, address, callback) {
  async function getAccounts() {
    const addresses = {};
    addresses[address] = address;
    return addresses;
  }

  async function signPersonalMessage(msgData) {
    return web3.eth.sign(msgData);
  }

  async function signTransaction(/*txData*/) {
    // const signedTx = web3.eth.sendTransaction(txData);
    // signedTx);
    // return {};
  }

  return new HookedWalletSubprovider({
    processTransaction: (txParams, cb) => {
      return web3.eth
        .sendTransaction(txParams)
        .on('hash', res => cb(null, res))
        .then(results => {
          callback(results);
        })
        .catch(err => cb(err, null));
    },
    getAccounts: callback => {
      return getAccounts()
        .then(res => callback(null, Object.values(res)))
        .catch(err => callback(err, null));
    },
    signPersonalMessage: (txData, callback) => {
      return signPersonalMessage(txData)
        .then(res => callback(null, res))
        .catch(err => callback(err, null));
    },
    signTransaction: (txData, callback) => {
      signTransaction(txData)
        .then(res => callback(null, res))
        .catch(err => callback(err, null));
    }
  });
}
