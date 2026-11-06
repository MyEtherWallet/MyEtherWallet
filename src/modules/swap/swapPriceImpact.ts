import type { ProviderQuoteResponse } from '@enkryptcom/swap'
import { outputUsd } from '@/modules/swap/swapMinAmount'

interface PricedToken {
  address: string
  decimals?: number
  price?: number | null
}

/**
 * Percent of its input's fiat value a quote loses, taken from the quote's own
 * amounts. The from field already holds a new amount while it waits on the
 * quote debounce, so pairing that field with the previous quote's output
 * flashed a ~90% impact on every keystroke (MEW-2644). A quote for another
 * pair, or a missing price, has no impact to show.
 */
export const quotePriceImpact = (
  quote: ProviderQuoteResponse | null | undefined,
  from: PricedToken | null | undefined,
  to: PricedToken | null | undefined,
): number => {
  if (!quote || !from || !to) return 0
  const { fromToken, toToken } = quote.quote.options
  if (fromToken.address !== from.address || toToken.address !== to.address)
    return 0
  const fromUsd = outputUsd(
    BigInt(quote.fromTokenAmount.toString()),
    from.decimals ?? 18,
    from.price,
  )
  const toUsd = outputUsd(
    BigInt(quote.toTokenAmount.toString()),
    to.decimals ?? 18,
    to.price,
  )
  if (!fromUsd?.gt(0) || !toUsd) return 0
  return fromUsd.minus(toUsd).div(fromUsd).times(100).toNumber()
}
