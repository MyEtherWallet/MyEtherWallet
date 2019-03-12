import HookedWalletSubprovider from 'web3-provider-engine/dist/es5/subproviders/hooked-wallet';

function stripHexPrefix(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/^0x/, '');
}

const ledgerLiveRegex = /^(44'\/(?:1|60|61)'\/)(\d+)('?)$/;

function makeError(msg, id) {
  const err = new Error(msg);
  // $FlowFixMe
  err.id = id;
  return err;
}

const defaultOptions = {
  networkId: 1, // mainnet
  path: "44'/60'/0'/0",
  askConfirm: false,
  accountsLength: 1,
  accountsOffset: 0
};

/**
 * Create a HookedWalletSubprovider for Ledger devices.
 * @param getTransport gets lazily called each time the device is needed. It is a function that returns a Transport instance. You can typically give `()=>TransportU2F.create()`
 * @example

 */
export default function createLedgerSubprovider(web3, address, options) {
  const { networkId, path, askConfirm, accountsLength, accountsOffset } = {
    ...defaultOptions,
    ...options
  };

  async function getAccounts() {
    console.log('getAccounts', arguments); // todo remove dev item
    const addresses = {};
    addresses[address] = address;
    return addresses;
  }

  async function signPersonalMessage(msgData) {
    return web3.eth.sign(msgData);
  }

  async function signTransaction(txData) {
    console.log('signTransaction'); // todo remove dev item
    console.log(txData); // todo remove dev item
    txData.generateOnly = true;
    txData.dsProxy = true;
    const signedTx = await web3.eth.signTransaction(txData);
    console.log('signedTx', signedTx); // todo remove dev item
    return signedTx.rawTransaction;
    // return `0x${tx.serialize().toString('hex')}`;
  }

  // return new HookedWalletSubprovider({
  //   getAccounts,
  //   signPersonalMessage,
  //   signTransaction
  // });

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
