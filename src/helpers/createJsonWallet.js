import { Wallet, WalletConfigs } from '@/helpers';
export default password => {
  return new Promise(resolve => {
    Wallet.create(WalletConfigs.params, dk => {
      Wallet.dump(
        password,
        dk.privateKey,
        dk.salt,
        dk.iv,
        WalletConfigs.options,
        walletJSON => {
          resolve({
            json: walletJSON,
            name: Wallet.generateKeystoreFilename(walletJSON.address)
          });
        }
      );
    });
  });
};
