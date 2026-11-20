import { Hardfork, Common } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction, LegacyTransaction } from '@ethereumjs/tx'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'
import type { HexPrefixedString } from '../types'

export const commonGenerator = (
  chainId: bigint,
  defaultHardfork: Hardfork.London | Hardfork.Berlin,
) => {
  return Common.custom({
    chainId: chainId,
    defaultHardfork,
  })
}

/** A serialized transaction read back, tagged with the kind it turned out to be. */
export type ParsedTransaction =
  | { readonly kind: 'eip1559'; readonly tx: FeeMarketEIP1559Transaction }
  | { readonly kind: 'legacy'; readonly tx: LegacyTransaction }

/**
 * Read a serialized transaction, signed or not, on the given chain.
 *
 * It is tried as EIP-1559 first and as legacy on failure (e.g. Rootstock): a
 * legacy RLP has no type byte, so only the payload tells the two apart.
 *
 * @throws when the bytes are a transaction of neither kind, or of another chain
 */
export const parseSerializedTx = (
  serializedTx: HexPrefixedString,
  chainId: string,
): ParsedTransaction => {
  const bytes = hexToBytes(serializedTx)
  try {
    return {
      kind: 'eip1559',
      tx: FeeMarketEIP1559Transaction.fromSerializedTx(bytes, {
        common: commonGenerator(BigInt(chainId), Hardfork.London),
      }),
    }
  } catch {
    return {
      kind: 'legacy',
      tx: LegacyTransaction.fromSerializedTx(bytes, {
        common: commonGenerator(BigInt(chainId), Hardfork.Berlin),
      }),
    }
  }
}

/** A transfer as the user reviewed it: what was sent to MEW's API for the quote. */
export interface ReviewedTransfer {
  /** The recipient, or the token contract for a token transfer. */
  to: string
  /** The native amount, as a hex quantity. */
  value: string
  /** The call data: `0x` for a plain transfer, the token's `transfer` call otherwise. */
  data: string
}

/**
 * Whether a transaction built elsewhere is the transfer the user reviewed:
 * the same destination, the same amount and the same call, on this chain.
 *
 * MEW's API builds the transaction a wallet signs. A wallet that signs inside
 * the app has no screen of its own, so without this a wrong or tampered
 * answer would be signed under a review that shows the right recipient.
 * Nonce, gas and fees are the API's to choose and are not compared.
 */
export const matchesReviewedTransfer = (
  serializedTx: HexPrefixedString,
  chainId: string,
  reviewed: ReviewedTransfer,
): boolean => {
  try {
    const { tx } = parseSerializedTx(serializedTx, chainId)
    return (
      tx.to?.toString().toLowerCase() === reviewed.to.toLowerCase() &&
      tx.value === BigInt(reviewed.value) &&
      bytesToHex(tx.data).toLowerCase() ===
        (reviewed.data || '0x').toLowerCase()
    )
  } catch {
    // Bytes that are no transaction of this chain, or a form that is no
    // transfer: neither is what the user reviewed.
    return false
  }
}
