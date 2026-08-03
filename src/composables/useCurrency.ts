import { storeToRefs } from 'pinia'
import BigNumber from 'bignumber.js'
import { useCurrencyStore } from '@/stores/currencyStore'
import {
  formatFiatValue,
  formatIntegerValue,
  convertToThousand,
  OneThousand,
  OneMillion,
} from '@/utils/numberFormatHelper'

export interface FormattedFiat {
  /** Formatted numeric part, e.g. "1,234.56" */
  value: string
  /** Currency symbol for the selected currency, e.g. "$", "€" */
  symbol: string
  /** Symbol + value ready for display, e.g. "€1,234.56" */
  display: string
  /** Full-precision value for tooltips, when the display value is truncated */
  tooltipText?: string
}

/**
 * App-wide fiat display helper. All prices in the app arrive in USD; this
 * converts a USD value to the user's selected display currency and formats it
 * with the correct symbol.
 *
 * Reactive: because `formatFiat` reads `rate`/`currencySymbol` at call time,
 * any component `computed`/template that calls it re-renders when the selected
 * currency changes. Do not cache its results outside a reactive scope.
 */
export const useCurrency = () => {
  const currencyStore = useCurrencyStore()
  const { selectedCurrency, currencySymbol, rate } = storeToRefs(currencyStore)

  const formatFiat = (
    usdValue: string | number | BigNumber | undefined | null,
  ): FormattedFiat => {
    const converted = new BigNumber(usdValue || 0).multipliedBy(rate.value)
    const formatted = formatFiatValue(converted)
    const symbol = currencySymbol.value
    return {
      value: formatted.value,
      symbol,
      display: `${symbol}${formatted.value}`,
      tooltipText: formatted.tooltipText,
    }
  }

  /**
   * Compact fiat display — abbreviates thousands/millions (e.g. "$20K",
   * "$20.6M") so large magnitudes (market cap, volume) stay short on cards.
   * Rate- and symbol-aware like `formatFiat`.
   */
  const formatFiatCompact = (
    usdValue: string | number | BigNumber | undefined | null,
  ): FormattedFiat => {
    const converted = new BigNumber(usdValue || 0).multipliedBy(rate.value)
    const abs = converted.absoluteValue()
    let value: string
    if (abs.isGreaterThanOrEqualTo(OneMillion)) {
      value = formatIntegerValue(converted).value
    } else if (abs.isGreaterThanOrEqualTo(OneThousand)) {
      value = convertToThousand(converted).value
    } else {
      value = formatFiatValue(converted).value
    }
    const symbol = currencySymbol.value
    return { value, symbol, display: `${symbol}${value}` }
  }

  return {
    currencyCode: selectedCurrency,
    currencySymbol,
    rate,
    formatFiat,
    formatFiatCompact,
  }
}
