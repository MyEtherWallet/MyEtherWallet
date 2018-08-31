export default class HardwareWalletInterface {
  constructor() {
    this.type = 'hardware';
    this.isHardwareWallet = true;
    this.defaultNetworkId = 1;
    this.defaultAccountsCount = 5;
    this.defaultAccountsOffset = 0;
  }

  // ============== (Start) EthereumJs-wallet interface methods ======================
  getPrivateKey() {
    return null;
  }

  getPrivateKeyString() {
    return null;
  }

  getPublicKey() {
    return null;
  }

  getPublicKeyString() {
    return null;
  }

  // Implementation required
  getAddress() {
    throw new Error('getAddress Not Implemented');
  }

  // Implementation required
  getAddressString() {
    throw new Error('getAddressString Not Implemented');
  }

  // ============== (End) EthereumJs-wallet interface methods ======================

  // ============== (Start) Utility methods ======================
  // Implementation required
  get compatibleChains() {
    throw new Error('compatibleChains getter Not Implemented');
  }

  // Implementation required
  getDerivationPath(/* networkShortName */) {
    throw new Error('getDerivationPath Not Implemented');
  }

  get isHardware() {
    return this.isHardwareWallet;
  }

  // Implementation required
  static async unlock() {
    // eslint-disable-next-line
    console.error(
      'unlock should not be an instance method  of the wallet constructor'
    );
    throw new Error('unlock Not Implemented');
  }

  // Implementation required
  setActiveAddress(/* address, index */) {
    throw new Error('setActiveAddress Not Implemented');
  }

  // Implementation required
  changeDerivationPath() {
    throw new Error('changePath Not Implemented');
  }

  // ============== (End) Required Utility methods ======================

  // ============== (Start) wallet usage methods ======================
  // Implementation required
  getAccounts() {
    throw new Error('getAccounts Not Implemented');
  }

  // Implementation required (if only a single account exists, it should be returned)
  getMultipleAccounts(/* count, offset */) {
    throw new Error('getMultipleAccounts Not Implemented');
  }

  // Implementation required
  signMessage(/* txData */) {
    throw new Error('signMessage Not Implemented');
  }

  // Implementation required
  signTransaction(/* txData */) {
    throw new Error('signTransaction Not Implemented');
  }

  // ============== (End) wallet usage methods ======================
}
