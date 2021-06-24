import WalletInterface from '@/modules/access-wallet/common/WalletInterface';

class HybridWalletInterface extends WalletInterface {
  constructor(
    pubkey,
    isHardware,
    identifier,
    txSigner,
    msgSigner,
    connection,
    errorHandler,
    icon
  ) {
    super(pubkey, true, identifier);
    this.errorHandler = errorHandler;
    this.txSigner = txSigner;
    this.msgSigner = msgSigner;
    this.isHardware = isHardware;
    this.connection = connection;
    this.icon = icon;
  }
  getConnection() {
    return this.connection;
  }
  signTransaction(txParams) {
    return super.signTransaction(txParams, this.txSigner);
  }
  signMessage(msg) {
    return super.signMessage(msg, this.msgSigner);
  }
}
export default HybridWalletInterface;
