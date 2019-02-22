import WalletInterface from './WalletInterface';
class HDWalletInterface extends WalletInterface {
  constructor(
    path,
    pubkey,
    isHardware,
    identifier,
    errorHandler,
    txSigner,
    msgSigner
  ) {
    super(pubkey, true, identifier);
    this.path = path;
    this.txSigner = txSigner;
    this.msgSigner = msgSigner;
    this.isHardware = isHardware;
    this.errorHandler = errorHandler;
  }
  signTransaction(txParams) {
    return super.signTransaction(txParams, this.txSigner);
  }
  signMessage(msg) {
    return super.signMessage(msg, this.msgSigner);
  }
}
export default HDWalletInterface;
