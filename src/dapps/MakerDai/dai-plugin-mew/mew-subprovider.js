import HookedWalletSubprovider from 'web3-provider-engine/dist/es5/subproviders/hooked-wallet';

export default function createLedgerSubprovider(web3, address) {

  async function getAccounts() {
    const addresses = {};
    addresses[address] = address;
    return addresses;
  }

  async function signPersonalMessage(msgData) {
    return web3.eth.sign(msgData);
  }

  async function signTransaction(txData) {
    txData.generateOnly = true;
    txData.dsProxy = true;
    const signedTx = await web3.eth.signTransaction(txData);
    return signedTx.rawTransaction;
  }

  return new HookedWalletSubprovider({
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
