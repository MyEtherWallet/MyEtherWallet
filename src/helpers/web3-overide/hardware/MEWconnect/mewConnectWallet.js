import MewConnect from '@myetherwallet/mewconnect-web-client'
import * as ethUtil from 'ethereumjs-util'
import Peer from 'simple-peer'
import IO from 'socket.io-client'

export default class MewConnectWallet {
  constructor (options) {
    this.isHardwareWallet = true
    this.identifier = 'MEWconnect'
    this.brand = 'MEW'
    this.wallet = null

    options = options || {}

    this.id = 0
    this.hdk = null
    this.numWallets = 0

    this.defaultOptions = {
      path: 'm/44\'/60\'/0\'/0' // trezor default derivation path
    }
    const currentOptions = {
      ...this.defaultOptions,
      ...options
    }

    this.signalerUrl = currentOptions.signalerUrl || 'https://connect.mewapi.io'
    this.networkId = 1

    this.mewConnect = MewConnect.Client.init(null, null, {
      wrtc: Peer,
      io: IO,
      ethUtils: ethUtil
    })

    this.getAccounts = this.getAccounts.bind(this)
    this.getMultipleAccounts = this.getMultipleAccounts.bind(this)
    this.signTransaction = this.signTransaction.bind(this)
    this.signMessage = this.signMessage.bind(this)

    // this.mewConnect.on('codeDisplay',  codeDisplay)
    // this.mewConnect.on('RtcConnectedEvent', rtcConnected)
    // this.mewConnect.on('RtcClosedEvent', rtcClosed)
    // this.mewConnect.on('address', makeWallet)
  }

  getMewConnect () {
    return this.mewConnect
  }

  // ============== (Start) EthereumJs-wallet interface methods ======================
  // Implementation required
  getAddress () {
    throw new Error('getAddress Not Implemented')
  }

  // Implementation required
  getAddressString () {
    throw new Error('getAddressString Not Implemented')
  }

  // ============== (End) EthereumJs-wallet interface methods ======================

  // ============== (Start) Utility methods ======================
  get isHardware () {
    return this.isHardwareWallet
  }

  // Implementation required
  static async unlock () {
    console.error('unlock should not be an instance method  of the wallet constructor')
  }

  // ============== (End) Required Utility methods ======================

  // ============== (Start) wallet usage methods ======================
  // Implementation required
  getAccounts () {
    throw new Error('getAccounts Not Implemented')
  }

  // Implementation required (if only a single account exists, it should be returned)
  getMultipleAccounts (count, offset) {
    throw new Error('getMultipleAccounts Not Implemented')
  }

  // Implementation required
  signMessage (txData) {
    throw new Error('signMessage Not Implemented')
  }

  // Implementation required
  signTransaction (txData) {
    throw new Error('signTransaction Not Implemented')
  }

  // ============== (Start) Internally used methods ======================

  setCodeDisplayListener (listener) {
    this.codeDisplayListener = listener
  }
  signalerConnect (url) {
    if (!url) {
      this.mewConnect.initiatorStart(this.signalerUrl)
    } else {
      this.mewConnect.initiatorStart(url)
    }
  }

  scanMewConnect () {
    // var app = new MewConnectEth()

    //
    // $scope.$on('$destroy', function () {
    //   $scope.mewConnect.disconnectRTC()
    //   if (MewConnect.instance) {
    //     Reflect.deleteProperty(MewConnect, 'instance')
    //   }
    // })

    app.setMewConnect($scope.mewConnect)
    app.signalerConnect()

    this.connectionCodeTimeout = null

    function rtcConnected (data) {
      if (this.connectionCodeTimeout) {
        clearTimeout(this.connectionCodeTimeout)
      }
      this.connectionCodeTimeout = null
      this.mewConnect.sendRtcMessage('address', '')
      this.mewConnectionStatus = 2
    }

    function rtcClosed (data) {
      this.mewConnectionStatus = 0
      this.wallet = null
    }

    function codeDisplay (data) {
      this.mewConnectionStatus = 1
      this.mewConnectCode = data
      this.connectionCodeTimeout = setTimeout(() => {
        this.mewConnectionStatus = 3
      }, 119800) // 200ms before the actual server timeout happens. (to account for transit time, ui lag, etc.)
    }

    function makeWallet (data) {
      // var wallet = app.createWallet(data)
      // this.wallet = wallet
    }
  }

  mewConnectDisconnect () {
    this.mewConnect.disconnectRTC()
  }
}
