import { Wallet, Configs } from '@/helpers';

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

  return Wallet.fromV3(newFile, password, true);
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
    }
  };
}
