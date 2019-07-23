import { Wallet, Configs } from '@/helpers';

const fromMyEtherWalletV2 = json => {
  if (json.privKey.length !== 64) {
    throw new Error('Invalid private key length');
  }
  const privKey = new Buffer(json.privKey, 'hex');
  return new Wallet(privKey);
};
const getWalletFromPrivKeyFile = (jsonfile, password) => {
  // filename hack for getting the file name once unlocked
  let wallet;
  if (jsonfile.encseed != null) {
    wallet = Wallet.fromEthSale(jsonfile, password);
    wallet.filename = wallet.getV3Filename();
    return wallet;
  } else if (jsonfile.Crypto != null || jsonfile.crypto != null) {
    wallet = Wallet.fromV3(jsonfile, password, true);
    wallet.filename = wallet.getV3Filename();
    return wallet;
  } else if (jsonfile.hash != null) {
    wallet = Wallet.ThirdParty.fromEtherWallet(jsonfile, password);
    wallet.filename = wallet.getV3Filename();
    return wallet;
  } else if (jsonfile.publisher == 'MyEtherWallet') {
    wallet = fromMyEtherWalletV2(jsonfile);
    wallet.filename = wallet.getV3Filename();
    return wallet;
  }
  throw new Error('Invalid Wallet file');
};

const createJsonWalletFromPrivateKey = (privateKey, password) => {
  const createdWallet = {};
  const wallet = new Wallet.fromPrivateKey(Buffer.from(privateKey, 'hex'));
  createdWallet.walletJson = wallet.toV3(password, {
    kdf: Configs.wallet.kdf,
    n: Configs.wallet.n
  });
  createdWallet.name = wallet.getV3Filename();
  return createdWallet;
};

const create = password => {
  const createdWallet = {};
  const wallet = new Wallet.generate();
  createdWallet.walletJson = wallet.toV3(password, {
    kdf: Configs.wallet.kdf,
    n: Configs.wallet.n
  });
  createdWallet.name = wallet.getV3Filename();
  return createdWallet;
};
const unlock = (file, password) => {
  const newFile = {};
  // Small hack because non strict wasn't working..
  Object.keys(file).forEach(key => {
    newFile[key.toLowerCase()] = file[key];
  });

  return getWalletFromPrivKeyFile(newFile, password);
};

// onmessage breaks tests as it is undefined
if (
  !navigator.userAgent.includes('Node.js') &&
  !navigator.userAgent.includes('jsdom')
) {
  onmessage = event => {
    if (event.data.type === 'createWallet') {
      const workerResult = create(event.data.data[0]);
      postMessage(workerResult);
    } else if (event.data.type === 'unlockWallet') {
      const workerResult = unlock(event.data.data[0], event.data.data[1]);
      postMessage(workerResult);
    } else if (event.data.type === 'generateFromPrivateKey') {
      const workerResult = createJsonWalletFromPrivateKey(
        event.data.data[0],
        event.data.data[1]
      );
      postMessage(workerResult);
    }
  };
}
