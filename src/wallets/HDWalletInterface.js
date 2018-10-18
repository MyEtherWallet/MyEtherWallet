import WalletInterface from './WalletInterface';
class HDWalletInterface extends WalletInterface {
  constructor(path, pubkey, isHardware, identifier, txSigner, msgSigner) {
    super(pubkey, true);
    this.path = path;
    this.txSigner = txSigner;
    this.msgSigner = msgSigner;
    this.isHardware = isHardware;
    this.identifier = identifier;
  }
  signTransaction(txParams) {
    return super.signTransaction(txParams, this.txSigner);
  }
  signMessage(msg) {
    return super.signMessage(msg, this.msgSigner);
  }
}
export default HDWalletInterface;
