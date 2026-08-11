import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { usePurchaseStore } from '@/stores/purchaseStore'
import { getCurrencySymbol } from '@/utils/currencySymbols'
import { analytics } from '@/analytics'
import * as Sentry from '@sentry/vue'

export interface SupportedCurrency {
  code: string
  /** Country / region label shown next to the code in the selector. */
  name: string
}

/**
 * App-wide display currencies. USD is the base currency all prices arrive in.
 * USD/EUR/GBP are listed first, the rest alphabetically by code.
 */
export const SUPPORTED_CURRENCIES: SupportedCurrency[] = [
  { code: 'USD', name: 'United States' },
  { code: 'EUR', name: 'France, Germany, Italy, Netherlands' },
  { code: 'GBP', name: 'United Kingdom' },
  { code: 'AED', name: 'United Arab Emirates' },
  { code: 'AUD', name: 'Australia' },
  { code: 'BDT', name: 'Bangladesh' },
  { code: 'BRL', name: 'Brazil' },
  { code: 'CAD', name: 'Canada' },
  { code: 'CHF', name: 'Switzerland' },
  { code: 'CNY', name: 'China' },
  { code: 'HKD', name: 'Hong Kong' },
  { code: 'IDR', name: 'Indonesia' },
  { code: 'INR', name: 'India' },
  { code: 'JPY', name: 'Japan' },
  { code: 'KRW', name: 'South Korea' },
  { code: 'MXN', name: 'Mexico' },
  { code: 'PKR', name: 'Pakistan' },
  { code: 'PLN', name: 'Poland' },
  { code: 'SGD', name: 'Singapore' },
  { code: 'THB', name: 'Thailand' },
  { code: 'TRY', name: 'Turkey' },
  { code: 'TWD', name: 'Taiwan' },
  { code: 'UAH', name: 'Ukraine' },
  { code: 'VND', name: 'Vietnam' },
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
