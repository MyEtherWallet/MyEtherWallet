import WalletInterface from './WalletInterface';
class HDWalletInterface extends WalletInterface {
  constructor(path, pubkey, txSigner, msgSigner) {
    super(pubkey, true);
    this.path = path;
    this.txSigner = txSigner;
    this.msgSigner = msgSigner;
  }
  signTransaction(txParams) {
    return super.signTransaction(txParams, this.txSigner);
  }
  signMessage(msg) {
    return super.signMessage(msg, this.msgSigner);
  }
}
export default HDWalletInterface;
