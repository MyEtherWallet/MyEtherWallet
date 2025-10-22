import { WalletType, type HexPrefixedString } from '../types'
import BaseBtcWallet from './baseBitcoinWallet'
import { Psbt } from 'bitcoinjs-lib'
import { INFO_MAP, UNISAT_MAP } from '../common/btcInfo'


class UnisatInjectWallet extends BaseBtcWallet {
  unisat: NonNullable<typeof window.unisat> // TODO: make or find proper instance
  address: string

  constructor(unisat: NonNullable<typeof window.unisat>, chainName: string) {
    super(chainName)

    this.unisat = unisat
    this.address = ''
  }

  override async connect(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const network = await this.unisat.getNetwork()
        if (UNISAT_MAP[this.chainName] !== network) {
          this.unisat.switchNetwork(UNISAT_MAP[this.chainName])
        }
        const accountArray: string[] = await this.unisat.requestAccounts()
        if (accountArray.length > 0) {
          const address = accountArray[0]
          this.address = address
          resolve(true)
        } else {
          resolve(false)
        }
      } catch (err) {
        reject(err)
      }
    })
  }

  override async SendTransaction(
    serializedTx: HexPrefixedString,
  ): Promise<HexPrefixedString> {
    try {
      const signedHexString = await this.unisat.signPsbt(
        serializedTx,
        { autoFinalized: false }
      )
      const psbtInstance = Psbt.fromHex(signedHexString, { network: INFO_MAP[this.chainName].network });
      psbtInstance.finalizeAllInputs();
      const tx = psbtInstance.extractTransaction(false);
      const txId = await this.broadcastTransaction(`0x${tx.toHex()}`)
      return txId as HexPrefixedString
    } catch (err) {
      throw err
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override SignMessage(options: {
    message: `0x${string}`
    options: unknown
  }): Promise<HexPrefixedString> {
    throw new Error('Method not implemented.')
  }
  override async getAddress(): Promise<string> {
    return new Promise(resolve => {
      resolve(this.address)
    })
  }

  override getWalletType(): WalletType {
    return WalletType.INJECTED
  }

  updateAddress(newAddress: string): void {
    this.address = newAddress
  }

  getProviderInstance(): NonNullable<typeof window.unisat> {
    return this.unisat
  }
}

export default UnisatInjectWallet
