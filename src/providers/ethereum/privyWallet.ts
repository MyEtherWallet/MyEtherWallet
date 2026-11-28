import { bytesToHex } from '@ethereumjs/util'
import type { EIP712TypedData } from '@1inch/limit-order-sdk'
import BaseEvmWallet from './baseEvmWallet'
import { parseSerializedTx, type ParsedTransaction } from './utils'
import type { PostSignedTransaction } from '../common/types'
import { PrivyLoginExpiredError, PrivySignatureError } from '../privy/errors'
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
  /**
   * Asked after a request failed: whether the Privy login behind this wallet
   * is gone. The auth store answers, and when it is gone has dropped it by
   * then; the wallet store turns this address watch-only shortly after.
   */
  loginLost: () => Promise<boolean>
}

const isHexPrefixed = (value: unknown): value is HexPrefixedString =>
  typeof value === 'string' && value.startsWith('0x')

/**
 * What Privy is asked to sign: the fields of the transaction MEW built, each
 * exactly as built. Privy fills in nothing, and the chain travels with the
 * transaction, so Privy's own list of chains does not come into it.
 */
const signingRequest = (
  unsigned: ParsedTransaction,
  from: HexPrefixedString,
  chainId: string,
) => {
  const { to, value, data, nonce, gasLimit } = unsigned.tx.toJSON()
  const shared = {
    from,
    to,
    value,
    data,
    nonce,
    gasLimit,
    chainId: Number(chainId),
  }
  switch (unsigned.kind) {
    case 'eip1559': {
      const { maxFeePerGas, maxPriorityFeePerGas } = unsigned.tx.toJSON()
      return { ...shared, maxFeePerGas, maxPriorityFeePerGas, type: 2 }
    }
    case 'legacy':
      return { ...shared, gasPrice: unsigned.tx.toJSON().gasPrice, type: 0 }
    default: {
      const _exhaustive: never = unsigned
      return _exhaustive
    }
  }
}

/**
 * Privy's answer, once it is shown to be the transaction that was asked for,
 * signed by this wallet. The signed bytes come from Privy's servers and go
 * straight to broadcast, so nothing else stands between a wrong answer and
 * the chain.
 *
 * @throws {PrivySignatureError} when the answer is not a transaction, signs
 *   other fields than the ones asked for, is unsigned, or was signed by
 *   another key
 */
const verifiedSignedTx = (
  unsigned: ParsedTransaction,
  answer: unknown,
  from: HexPrefixedString,
  chainId: string,
): HexPrefixedString => {
  if (!isHexPrefixed(answer)) {
    throw new PrivySignatureError('not_a_transaction')
  }
  const signed = parseSerializedTx(answer, chainId)
  const signsWhatWasAsked =
    signed.kind === unsigned.kind &&
    bytesToHex(signed.tx.getHashedMessageToSign()) ===
      bytesToHex(unsigned.tx.getHashedMessageToSign())
  const signedByThisWallet =
    signed.tx.isSigned() &&
    signed.tx.getSenderAddress().toString().toLowerCase() === from.toLowerCase()
  if (!signsWhatWasAsked || !signedByThisWallet) {
    throw new PrivySignatureError('different_transaction')
  }
  return answer
}

/**
 * The embedded wallet of a Privy login (Google / email), exposed through the
 * app's wallet abstraction. Disconnecting it logs out of Privy; the wallet
 * store then falls back to the same address as watch-only.
 *
 * It signs like a private key wallet: Privy signs the transaction MEW built
 * and MEW broadcasts it. Privy shows no prompt of its own, so the app's
 * review screen is the user's consent.
 */
class PrivyWallet extends BaseEvmWallet {
  private readonly provider: Eip1193Provider
  private readonly address: HexPrefixedString
  private readonly logout: () => Promise<void>
  private readonly loginLost: () => Promise<boolean>

  constructor({
    provider,
    address,
    chainId,
    logout,
    loginLost,
  }: PrivyWalletOptions) {
    super(chainId)
    this.provider = provider
    this.address = address
    this.logout = logout
    this.loginLost = loginLost
  }

  /**
   * Ask Privy's provider. A failure with the login gone is reported as the
   * expired login it is, so the user is told to log in again and not shown
   * whatever the provider happened to say.
   */
  private async request(args: {
    method: string
    params?: unknown[]
  }): Promise<unknown> {
    try {
      return await this.provider.request(args)
    } catch (error) {
      if (await this.loginLost()) throw new PrivyLoginExpiredError()
      throw error
    }
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

  /**
   * Privy is not asked to switch: its SDK rejects every chain outside its own
   * list, which is shorter than MEW's, and nothing here needs it to follow.
   * A transaction carries its chain id, and messages are signed off-chain.
   */
  override async changeNetwork(chainId: number): Promise<boolean> {
    this.chainId = chainId.toString()
    return true
  }

  override async SignTransaction(
    serializedTx: HexPrefixedString,
  ): Promise<PostSignedTransaction> {
    const unsigned = parseSerializedTx(serializedTx, this.chainId)
    const answer = await this.request({
      method: 'eth_signTransaction',
      params: [signingRequest(unsigned, this.address, this.chainId)],
    })
    return {
      signed: verifiedSignedTx(unsigned, answer, this.address, this.chainId),
    }
  }

  override async SignMessage(options: {
    message: string
    options?: unknown
  }): Promise<HexPrefixedString> {
    const signature = await this.request({
      method: 'personal_sign',
      params: [options.message, this.address],
    })
    return signature as HexPrefixedString
  }

  override async SignTypedMessage(
    typedData: EIP712TypedData,
  ): Promise<HexPrefixedString> {
    const signature = await this.request({
      method: 'eth_signTypedData_v4',
      params: [this.address, JSON.stringify(typedData)],
    })
    return signature as HexPrefixedString
  }
}

export default PrivyWallet
