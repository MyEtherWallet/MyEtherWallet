import type { ProviderQuoteResponse } from '@enkryptcom/swap'
import { outputUsd } from '@/modules/swap/swapMinAmount'

interface PricedToken {
  address: string
  decimals?: number
  price?: number | null
}

/** Above this loss, in percent of the input's fiat value, a quote can't be swapped. */
export const MAX_PRICE_IMPACT = 10

/**
 * Percent of its input's fiat value a quote loses, taken from the quote's own
 * amounts. The from field already holds a new amount while it waits on the
 * quote debounce, so pairing that field with the previous quote's output
 * flashed a ~90% impact on every keystroke (MEW-2644). A quote for another
 * pair has no impact to show (0). A missing price makes it unknown (null):
 * reading that as 0% let a bad rate pass without a warning (MEW-2649).
 */
export const quotePriceImpact = (
  quote: ProviderQuoteResponse | null | undefined,
  from: PricedToken | null | undefined,
  to: PricedToken | null | undefined,
): number | null => {
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
  if (!fromUsd || !toUsd) return null
  if (!fromUsd.gt(0)) return 0
  return fromUsd.minus(toUsd).div(fromUsd).times(100).toNumber()
}

export const isPriceImpactTooHigh = (impact: number | null) =>
  impact !== null && impact > MAX_PRICE_IMPACT
