import { storeToRefs } from 'pinia'
import BigNumber from 'bignumber.js'
import { useCurrencyStore } from '@/stores/currencyStore'
import { formatFiatValue } from '@/utils/numberFormatHelper'

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

  return {
    currencyCode: selectedCurrency,
    currencySymbol,
    rate,
    formatFiat,
  }
}
