import { toHex } from 'viem'
import type { EIP712TypedData } from '@1inch/limit-order-sdk'
import BaseEvmWallet from './baseEvmWallet'
import { WalletType, type HexPrefixedString } from '../types'

/** The part of Privy's embedded wallet provider this wallet uses (EIP-1193). */
type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
}

type PrivyWalletOptions = {
  provider: Eip1193Provider
  address: HexPrefixedString
  chainId: string
  /** Ends the Privy login this wallet belongs to (supplied by the auth store). */
  logout: () => Promise<void>
}

/**
 * The embedded wallet of a Privy login (Google / email), exposed through the
 * app's wallet abstraction. Disconnecting it logs out of Privy; the wallet
 * store then falls back to the same address as watch-only.
 *
 * Signs messages and typed data. Sending transactions is not wired yet.
 */
class PrivyWallet extends BaseEvmWallet {
  private readonly provider: Eip1193Provider
  private readonly address: HexPrefixedString
  private readonly logout: () => Promise<void>

  constructor({ provider, address, chainId, logout }: PrivyWalletOptions) {
    super(chainId)
    this.provider = provider
    this.address = address
    this.logout = logout
  }

  // The wallet store does not await this, so it must never reject.
  override async disconnect(): Promise<boolean> {
    try {
      await this.logout()
      return true
    } catch {
      return false
    }
  }

  override async getAddress(): Promise<HexPrefixedString> {
    return this.address
  }

  override getWalletType(): WalletType {
    return WalletType.PRIVY
  }

  override async changeNetwork(chainId: number): Promise<boolean> {
    if (chainId === Number(this.chainId)) return true
    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: toHex(chainId) }],
      })
      this.chainId = chainId.toString()
      return true
    } catch {
      return false
    }
  }

  override async SignMessage(options: {
    message: string
    options?: unknown
  }): Promise<HexPrefixedString> {
    const signature = await this.provider.request({
      method: 'personal_sign',
      params: [options.message, this.address],
    })
    return signature as HexPrefixedString
  }

  override async SignTypedMessage(
    typedData: EIP712TypedData,
  ): Promise<HexPrefixedString> {
    const signature = await this.provider.request({
      method: 'eth_signTypedData_v4',
      params: [this.address, JSON.stringify(typedData)],
    })
    return signature as HexPrefixedString
  }
}

export default PrivyWallet
