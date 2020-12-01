import { Wallet, Configs } from '@/helpers';
export default password => {
  const createdWallet = {};
  const wallet = new Wallet.generate();
  createdWallet.walletJson = wallet.toV3(password, {
    kdf: Configs.wallet.kdf,
    n: Configs.wallet.n
  });
  createdWallet.name = wallet.getV3Filename();
  return createdWallet;
};
