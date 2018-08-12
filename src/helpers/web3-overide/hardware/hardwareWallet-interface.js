export default class HardwareWalletInterface {
  constructor () {
    this.type = 'hardware'
    this.isHardwareWallet = true
    this.defaultNetworkId = 1
    this.defaultAccountsCount = 5
    this.defaultAccountsOffset = 0
  }

  // ============== (Start) EthereumJs-wallet interface methods ======================
  getPrivateKey () {
    return null
  }

  getPrivateKeyString () {
    return null
  }

  getPublicKey () {
    return null
  }

  getPublicKeyString () {
    return null
  }

  // Required interface methods
  getAddress () {
    throw new Error('getAddress Not Implemented')
  }

  getAddressString () {
    throw new Error('getAddressString Not Implemented')
  }

  getChecksumAddressString () {
    throw new Error('getChecksumAddressString Not Implemented')
  }

  // ============== (End) EthereumJs-wallet interface methods ======================

  // ============== (Start) Required Utility methods ======================
  get isHardware () {
    return this.isHardwareWallet
  }

  static async unlock () {
    console.error('unlock should not be an instance method  of the wallet constructor')
    throw new Error('unlock Not Implemented')
  }

  setActiveAddress (address, index) {
    throw new Error('setActiveAddress Not Implemented')
  }

  // ============== (End) Required Utility methods ======================

  // ============== (Start) wallet usage methods ======================
  getAccounts () {
    throw new Error('getAccounts Not Implemented')
  }

  getMultipleAccounts (count, offset) {
    throw new Error('getMultipleAccounts Not Implemented')
  }

  signMessage (txData) {
    throw new Error('signMessage Not Implemented')
  }

  signTransaction (txData) {
    throw new Error('signTransaction Not Implemented')
  }

  // ============== (End) wallet usage methods ======================
}
