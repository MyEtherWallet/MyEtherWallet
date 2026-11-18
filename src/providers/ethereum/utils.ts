import { Hardfork, Common } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction, LegacyTransaction } from '@ethereumjs/tx'
import { hexToBytes } from '@ethereumjs/util'
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
