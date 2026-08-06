import { toHex } from 'viem'
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
      const signedHexString = await this.unisat.signPsbt(serializedTx, {
        autoFinalized: false,
      })
      const psbtInstance = Psbt.fromHex(signedHexString, {
        network: INFO_MAP[this.chainName].network,
      })
      psbtInstance.finalizeAllInputs()
      const tx = psbtInstance.extractTransaction(false)
      const txId = await this.broadcastTransaction(`0x${tx.toHex()}`)
      return txId as HexPrefixedString
    } catch (err) {
      throw err
    }
  }

  override async getAddress(): Promise<string> {
    return new Promise(resolve => {
      resolve(this.address)
    })
  }

  async getLiveAddress(): Promise<string | null> {
    try {
      const accounts = await this.unisat.getAccounts()
      return accounts?.[0] ?? null
    } catch {
      return null
    }
  }

  override async getPublicKey(): Promise<HexPrefixedString> {
    // Unisat returns the compressed public key as bare hex; normalize to the
    // 0x-prefixed form used across the app.
    const publicKey = await this.unisat.getPublicKey()
    return (
      publicKey.startsWith('0x') ? publicKey : `0x${publicKey}`
    ) as HexPrefixedString
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

  override async SignMessage(options: {
    message: string
    options?: unknown
  }): Promise<HexPrefixedString> {
    const provider = this.getProviderInstance()
    const signature = await provider.signMessage(toHex(options.message))
    return signature as HexPrefixedString
  }
}

export default UnisatInjectWallet
