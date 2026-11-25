import type { WalletInterface } from '@/providers/common/walletInterface'
import type { HexPrefixedString } from '@/providers/types'
import {
  isSignableWallet,
  isUnsupportedMethodError,
  isUserRejectionError,
} from '@/utils/walletUtils'
import { AbandonedSignError } from '@/utils/signSession'

export interface WalletSendOptions {
  /** True once the request was abandoned (its modal was closed, MEW-2694). */
  isAbandoned?: () => boolean
  /** Where a signed transaction goes. Defaults to the wallet's own broadcast. */
  broadcast?: (signedTx: HexPrefixedString) => Promise<string>
}

// WalletConnect gives a request five minutes; after that the wallet has
// dropped it, so asking again another way would only confuse.
const isRequestExpiredError = (e: unknown) =>
  /request expired/i.test((e as { message?: string })?.message ?? '')

/**
 * Whether MEW gets the signature back from `wallet` and broadcasts it itself,
 * rather than the wallet signing and broadcasting in one step.
 */
export const signsWithoutSending = async (
  wallet: WalletInterface,
): Promise<boolean> =>
  isSignableWallet(wallet) ||
  (!!wallet.SignTransaction && !!(await wallet.canSignWithoutSending?.()))

/**
 * First half of sending `serializedTx` from `wallet`: the part that may need
 * the user. Resolves with the second half, which puts the transaction on the
 * network and resolves with its hash.
 *
 * Wherever the wallet can sign without sending — hardware and key wallets
 * always, a WalletConnect wallet when its session offers the call — MEW gets
 * the signature back and broadcasts it itself. That is what lets an abandoned
 * request be dropped: a signature that arrives late is thrown away here and
 * never reaches the network.
 *
 * Every other wallet (browser extensions, WalletConnect wallets without the
 * call) signs and broadcasts in one step. Nothing can stop those once the
 * request is in the wallet, so for them the prompt comes in the second half.
 */
export const signForSend = async (
  wallet: WalletInterface,
  serializedTx: HexPrefixedString,
  options: WalletSendOptions = {},
): Promise<() => Promise<string>> => {
  const isAbandoned = options.isAbandoned ?? (() => false)
  const broadcast =
    options.broadcast ??
    ((signedTx: HexPrefixedString) => wallet.broadcastTransaction(signedTx))
  // Checked before every wallet prompt and every broadcast: a request closed
  // while an earlier step was pending goes no further.
  const stopIfAbandoned = () => {
    if (isAbandoned()) throw new AbandonedSignError()
  }
  const signed = (signedTx: HexPrefixedString) => {
    stopIfAbandoned()
    return () => {
      stopIfAbandoned()
      return broadcast(signedTx)
    }
  }

  if (isSignableWallet(wallet)) {
    if (!wallet.SignTransaction) {
      throw new Error('The connected wallet cannot sign transactions')
    }
    return signed((await wallet.SignTransaction(serializedTx)).signed)
  }

  if (wallet.SignTransaction && (await wallet.canSignWithoutSending?.())) {
    stopIfAbandoned()
    let signedTx: HexPrefixedString | undefined
    try {
      signedTx = (await wallet.SignTransaction(serializedTx)).signed
    } catch (e) {
      // The user's answer, or no answer in time: that is the outcome.
      const userSaidNo = isUserRejectionError(e) && !isUnsupportedMethodError(e)
      if (isAbandoned() || userSaidNo || isRequestExpiredError(e)) throw e
      // Otherwise the wallet listed the call but would not do it. Nothing was
      // signed, so it is safe to send the usual way.
    }
    if (signedTx) return signed(signedTx)
  }

  return () => {
    stopIfAbandoned()
    if (!wallet.SendTransaction) {
      throw new Error('The connected wallet cannot send transactions')
    }
    return wallet.SendTransaction(serializedTx)
  }
}

/** Both halves of `signForSend` in one call. */
export const sendFromWallet = async (
  wallet: WalletInterface,
  serializedTx: HexPrefixedString,
  options: WalletSendOptions = {},
): Promise<string> => (await signForSend(wallet, serializedTx, options))()
