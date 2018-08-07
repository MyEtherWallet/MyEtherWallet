import EthereumTx from 'ethereumjs-tx'
import Ledger from '@ledgerhq/hw-app-eth'
import u2fTransport from '@ledgerhq/hw-transport-u2f'

// const allowedHdPaths = ["44'/60'", "44'/61'"]
// const NOT_SUPPORTED_ERROR_MSG =
//   'LedgerWallet uses U2F which is not supported by your browser. ' +
//   'Use Chrome, Opera or Firefox with a U2F extension.' +
//   "Also make sure you're on an HTTPS connection"

/**
 * THE CONNECTION STATUS, STATE, AND ACTIONS ALL OPERATE FROM THE TRANSPORT INSTANCE PASSED TO THE LEDGER APP INTERFACE
 */
// TODO (MAYBE) create a wallet object that can be used for simple operation on the frontent (i.e. balance, display, etc.)
export default class LedgerWallet {
  constructor (opts) {
    this.identifier = 'LedgerNanoS'
    this.wallet = null
    this.activeAddress = ''
    this.activeAddressIndex = ''
    let options = opts || {}
    if (options.transport) this.ledgerTransport = options.transport
    this.allowedHdPaths = options.options || ['44\'/60\'', '44\'/61\'']
    this.defaultOptions = {
      networkId: 1, // mainnet
      path: '44\'/60\'/0\'/0', // ledger default derivation path
      askConfirm: false,
      accountsLength: 5,
      accountsOffset: 0
    }

    const currentOptions = {
      ...this.defaultOptions,
      ...options
    }
    this.checkIfAllowedPath(currentOptions.path)

    this.networkId = currentOptions.networkId
    this.path = currentOptions.path
    this.askConfirm = currentOptions.askConfirm
    this.accountsLength = currentOptions.accountsLength
    this.accountsOffset = currentOptions.accountsOffset
    this.addressToPathMap = {}
    this.pathComponents = this.obtainPathComponentsFromDerivationPath(this.path)

    this.isU2FSupported = true
    this.activeConnection = null
    this.accountsRetrieved = false
    this.connectionOpened = false
    // console.log(this); // todo remove dev item
    this.getAppConfig = this.getAppConfig.bind(this)
    this.getAccounts = this.getAccounts.bind(this)
    this.getMultipleAccounts = this.getMultipleAccounts.bind(this)
    this.signTransaction = this.signTransaction.bind(this)
    this.signMessage = this.signPersonalMessage.bind(this)
    this.changeNetwork = this.changeNetwork.bind(this)
    // this.getLedgerConnection = this.getLedgerConnection.bind(this)
    // this.setDerivationPath = this.setDerivationPath.bind(this)
    // this.setDerivationPath(path)
    // this.getAccounts()
  }

  getAddress () {
    return this.wallet.address
  }

  changePath (path) {
    this.path = path
  }

  setActiveAddress (address, index) {
    this.wallet = {}
    this.wallet.address = address
    // this.activeAddressIndex = index
    this.wallet.path = this.pathComponents.basePath + index.toString()
    this.wallet.hwType = 'ledger'
    this.wallet.hwTransport = undefined
    this.wallet.type = 'default'
  }

  changeNetwork (networkId, path) {
    this.networkId = networkId
    this.path = path
  }

  getAccounts (callback) {
    let _this = this
    if (arguments.length > 1) {
      return _this.getMultipleAccounts(arguments[0], arguments[1], arguments[2])
    } else {
      return _this._getAccounts()
    }
  }

  getMultipleAccounts (count, offset) {
    return this._getAccounts(count, offset)
  }

  signPersonalMessage (txData, callback) {
    return this._signPersonalMessage(txData)
    // .then(res => callback(null, res))
    // .catch(err => callback(err, null))
  }

  signTransaction (txData, callback) {
    return this._signTransaction(txData)
    // .then(res => callback(null, res))
    // .catch(err => callback(err, null))
  }

  checkIfAllowedPath (path) {
    if (!this.allowedHdPaths.some(hdPref => path.startsWith(hdPref))) {
      throw this.makeError(
        'Ledger derivation path allowed are ' +
        this.allowedHdPaths.join(', ') +
        '. ' +
        path +
        ' is not supported',
        'InvalidDerivationPath'
      )
    }
  }

  makeError (msg, id) {
    const err = new Error(msg)
    // $FlowFixMe
    err.id = id
    return err
  }

  obtainPathComponentsFromDerivationPath (derivationPath) {
    // check if derivation path follows 44'/60'/x'/n pattern
    const regExp = /^(44'\/(?:1|60|61)'\/\d+'?\/)(\d+)$/
    const matchResult = regExp.exec(derivationPath)
    if (matchResult === null) {
      throw this.makeError(
        'To get multiple accounts your derivation path must follow pattern 44\'/60|61\'/x\'/n ',
        'InvalidDerivationPath'
      )
    }
    return {basePath: matchResult[1], index: parseInt(matchResult[2], 10)}
  }

  getTransport () {
    if (this.connectionOpened) {
      throw new Error(
        'You can only have one ledger connection active at a time'
      )
    } else {
      this.connectionOpened = true
      // eslint-disable-next-line new-cap
      if (this.ledgerTransport) {
        return this.ledgerTransport.create(3000, 3000)
      } else {
        // u2fTransport.open();
        return u2fTransport.create(3000, 3000)
      }
    }
  }

  async _getAccounts (_accountsLength, _accountsOffset) {
    const transport = await this.getTransport()
    try {
      const accountsOffset = _accountsOffset || this.accountsOffset
      const accountsLength = _accountsLength || this.accountsLength
      const eth = new Ledger(transport)
      const addresses = {}
      for (let i = accountsOffset; i < accountsOffset + accountsLength; i++) {
        const path =
          this.pathComponents.basePath + (this.pathComponents.index + i).toString() // (i).toString()
        const address = await eth.getAddress(path, this.askConfirm, false)
        // addresses[path] = address.address
        addresses[i] = address.address
        this.addressToPathMap[address.address.toLowerCase()] = path
      }

      return addresses
    } finally {
      transport.close()
        .then(() => { this.connectionOpened = false })
        .catch((error) => { throw error })
    }
  }

  async getAppConfig (callback) {
    const transport = await this.getTransport()
    try {
      const eth = new Ledger(transport)
      const appConfig = await eth.getAppConfiguration()
      callback(null, appConfig)
    } catch (e) {
      callback(e)
    } finally {
      transport.close()
        .then(() => { this.connectionOpened = false })
        .catch((error) => { throw error })
    }
  }

  async checkIfKnownAddress (data) {
    // await this._getAccounts()
    let path
    if (!this.accountsRetrieved) {
      await this._getAccounts()
      path = this.addressToPathMap[data.from.toLowerCase()]
      if (!path) throw new Error('address unknown \'' + data.from + '\'')
      return path
    } else {
      path = this.addressToPathMap[data.from.toLowerCase()]
      if (!path) throw new Error('address unknown \'' + data.from + '\'')
      return path
    }
  }

  async _signPersonalMessage (msgData) {
    const path = await this.checkIfKnownAddress(msgData)
    const transport = await this.getTransport()
    try {
      const eth = new Ledger(transport)
      const result = await eth.signPersonalMessage(
        path,
        msgData
      )
      const v = parseInt(result.v, 10) - 27
      let vHex = v.toString(16)
      if (vHex.length < 2) {
        vHex = `0${v}`
      }
      return `0x${result.r}${result.s}${vHex}`
    } finally {
      transport.close()
        .then(() => { this.connectionOpened = false })
        .catch((error) => { throw error })
    }
  }

  async _signTransaction (txData) {
    // const path = this.addressToPathMap[txData.from.toLowerCase()]
    // if (!path) throw new Error("address unknown '" + txData.from + "'")
    const path = await this.checkIfKnownAddress(txData)
    const transport = await this.getTransport()
    try {
      const eth = new Ledger(transport)
      const tx = new EthereumTx(txData)

      // Set the EIP155 bits
      tx.raw[6] = Buffer.from([this.networkId]) // v
      tx.raw[7] = Buffer.from([]) // r
      tx.raw[8] = Buffer.from([]) // s

      // Pass hex-rlp to ledger for signing
      const result = await eth.signTransaction(
        path,
        tx.serialize().toString('hex')
      )

      // Store signature in transactionf
      tx.v = Buffer.from(result.v, 'hex')
      tx.r = Buffer.from(result.r, 'hex')
      tx.s = Buffer.from(result.s, 'hex')

      // EIP155: v should be chain_id * 2 + {35, 36}
      const signedChainId = Math.floor((tx.v[0] - 35) / 2)
      const validChainId = this.networkId & 0xff // FIXME this is to fixed a current workaround that app don't support > 0xff
      if (signedChainId !== validChainId) {
        throw this.makeError(
          'Invalid networkId signature returned. Expected: ' +
          this.networkId +
          ', Got: ' +
          signedChainId,
          'InvalidNetworkId'
        )
      }

      return `0x${tx.serialize().toString('hex')}`
    } finally {
      transport.close()
        .then(() => { this.connectionOpened = false })
        .catch((error) => { throw error })
    }
  }
}
