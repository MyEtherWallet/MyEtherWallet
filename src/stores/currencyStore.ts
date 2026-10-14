import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { usePurchaseStore } from '@/stores/purchaseStore'
import { getCurrencySymbol } from '@/utils/currencySymbols'
import { analytics } from '@/analytics'
import * as Sentry from '@sentry/vue'

export interface SupportedCurrency {
  code: string
}

/**
 * App-wide display currencies. USD is the base currency all prices arrive in.
 * USD/EUR/GBP are listed first, the rest alphabetically by code.
 *
 * The country / region label shown next to each code in the selector is
 * localized via i18n (`settings.currency_country.<code>`), so it is not
 * stored here — keep this list and that i18n block in sync.
 */
export const SUPPORTED_CURRENCIES: SupportedCurrency[] = [
  { code: 'USD' },
  { code: 'EUR' },
  { code: 'GBP' },
  { code: 'AED' },
  { code: 'AUD' },
  { code: 'BDT' },
  { code: 'BRL' },
  { code: 'CAD' },
  { code: 'CHF' },
  { code: 'CNY' },
  { code: 'HKD' },
  { code: 'IDR' },
  { code: 'INR' },
  { code: 'JPY' },
  { code: 'KRW' },
  { code: 'MXN' },
  { code: 'PKR' },
  { code: 'PLN' },
  { code: 'SGD' },
  { code: 'THB' },
  { code: 'TRY' },
  { code: 'TWD' },
  { code: 'UAH' },
  { code: 'VND' },
]

const SUPPORTED_CODES = new Set(SUPPORTED_CURRENCIES.map(c => c.code))
const DEFAULT_CURRENCY = 'USD'

export const useCurrencyStore = defineStore('currency', () => {
  // Persisted app-wide display currency (USD by default).
  const selectedCurrency = useLocalStorage<string>(
    'mew-selected-currency',
    DEFAULT_CURRENCY,
  )

  /**
   * USD → selectedCurrency multiplier. USD is the base (rate 1). Falls back to
   * 1 if the rate for the selected currency is not (yet) available so amounts
   * stay sensible rather than collapsing to zero.
   * Reads the purchaseStore lazily to avoid a store-instantiation cycle
   * (walletStore → currencyStore → purchaseStore → walletStore).
   */
  const rate = computed<number>(() => {
    if (selectedCurrency.value === 'USD') return 1
    const purchaseStore = usePurchaseStore()
    return purchaseStore.exchangeRates.get(selectedCurrency.value) ?? 1
  })

  const currencySymbol = computed<string>(() =>
    getCurrencySymbol(selectedCurrency.value),
  )

  const setCurrency = (code: string) => {
    if (!code || !SUPPORTED_CODES.has(code)) return
    selectedCurrency.value = code
    analytics.setCurrency(code)
    Sentry.setTag('currency', code)
  }

  /** Ensure exchange rates are loaded (idempotent — no-op if already fetched). */
  const ensureRates = async () => {
    const purchaseStore = usePurchaseStore()
    await purchaseStore.fetchExchangeRates()
  }

  return {
    selectedCurrency,
    rate,
    currencySymbol,
    setCurrency,
    ensureRates,
  }
})
