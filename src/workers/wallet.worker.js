import { Wallet, Configs } from '@/helpers';

function create(password) {
  const createdWallet = {};
  const wallet = new Wallet.generate();
  createdWallet.walletJson = wallet.toV3(password, {
    kdf: Configs.wallet.kdf,
    n: Configs.wallet.n
  });
  createdWallet.name = wallet.getV3Filename();
  return createdWallet;
}

// onmessage breaks tests as it is undefined
if (
  !navigator.userAgent.includes('Node.js') &&
  !navigator.userAgent.includes('jsdom')
) {
  onmessage = function(event) {
    if (event.data.type === 'createWallet') {
      const workerResult = create(event.data.data[0]);
      postMessage(workerResult);
    }
  };
}
