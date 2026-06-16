import type { NetworkNames } from '@enkryptcom/types'
import {
  LedgerEthereum,
  type AddressResponse,
  type GetAddressRequest,
  type SignPersonalMessageRequest as EthSignPersonalMessageRequest,
  type SignTransactionRequest as EthSignTransactionRequest,
  type SignTypedMessageRequest,
} from './ledgerEthereum'
import {
  LedgerBitcoin,
  type BtcGetAddressRequest,
  type BtcSignPersonalMessageRequest,
  type BtcSignTransactionRequest,
} from './ledgerBitcoin'
import {
  isBtcNetwork,
  isEvmNetwork,
  isLedgerNetworkSupported,
  type PathType,
} from './configs'
import { closeLedgerTransport } from './transport'

export type LedgerProvider = LedgerEthereum | LedgerBitcoin

interface BaseOptions {
  networkName: NetworkNames
}

export type LedgerGetAddressOptions = BaseOptions &
  (GetAddressRequest | BtcGetAddressRequest)

export type LedgerSignPersonalMessageOptions = BaseOptions &
  (EthSignPersonalMessageRequest | BtcSignPersonalMessageRequest)

export type LedgerSignTransactionOptions = BaseOptions &
  (EthSignTransactionRequest | BtcSignTransactionRequest)

export type LedgerSignTypedMessageOptions = BaseOptions & SignTypedMessageRequest

export default class LedgerManager {
  private providers: Partial<Record<NetworkNames, LedgerProvider>> = {}

  private async getProvider(network: NetworkNames): Promise<LedgerProvider> {
    const existing = this.providers[network]
    if (existing) return existing
    let provider: LedgerProvider
    if (isEvmNetwork(network)) {
      provider = new LedgerEthereum(network)
    } else if (isBtcNetwork(network)) {
      provider = new LedgerBitcoin(network)
    } else {
      throw new Error(`ledger: no provider for network: ${network}`)
    }
    await provider.init()
    this.providers[network] = provider
    return provider
  }

  async isConnected(options: BaseOptions): Promise<boolean> {
    const p = await this.getProvider(options.networkName)
    return p.isConnected()
  }

  async getAddress(options: LedgerGetAddressOptions): Promise<AddressResponse> {
    const p = await this.getProvider(options.networkName)
    if (p instanceof LedgerEthereum) {
      return p.getAddress(options as GetAddressRequest)
    }
    return p.getAddress(options as BtcGetAddressRequest)
  }

  async signPersonalMessage(
    options: LedgerSignPersonalMessageOptions,
  ): Promise<string> {
    const p = await this.getProvider(options.networkName)
    if (p instanceof LedgerEthereum) {
      return p.signPersonalMessage(options as EthSignPersonalMessageRequest)
    }
    return p.signPersonalMessage(options as BtcSignPersonalMessageRequest)
  }

  async signTransaction(
    options: LedgerSignTransactionOptions,
  ): Promise<string> {
    const p = await this.getProvider(options.networkName)
    if (p instanceof LedgerEthereum) {
      return p.signTransaction(options as EthSignTransactionRequest)
    }
    return p.signTransaction(options as BtcSignTransactionRequest)
  }

  async signTypedMessage(
    options: LedgerSignTypedMessageOptions,
  ): Promise<string> {
    const p = await this.getProvider(options.networkName)
    if (!(p instanceof LedgerEthereum)) {
      throw new Error('ledger: signTypedMessage is only supported on EVM networks')
    }
    return p.signTypedMessage(options)
  }

  async getSupportedPaths(options: BaseOptions): Promise<PathType[]> {
    if (isEvmNetwork(options.networkName)) {
      return new LedgerEthereum(options.networkName).getSupportedPaths()
    }
    if (isBtcNetwork(options.networkName)) {
      return new LedgerBitcoin(options.networkName).getSupportedPaths()
    }
    return []
  }

  isNetworkSupported(networkName: NetworkNames): boolean {
    return isLedgerNetworkSupported(networkName)
  }

  async close(): Promise<void> {
    this.providers = {}
    await closeLedgerTransport()
  }
}

export { LedgerEthereum, LedgerBitcoin }
export type { PathType } from './configs'
