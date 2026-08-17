import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import {
  PURCHASE_CHAIN_TO_V7,
  type PurchaseInfo,
  type PurchaseAsset,
  type BuyQuote,
  type SellQuote,
  type FetchBuyQuotesParams,
  type FetchSellQuoteParams,
} from '@/types/buyToken'
import { useChainsStore } from '@/stores/chainsStore'
import { useWalletStore } from '@/stores/walletStore'
import configs from '@/configs'
import { sha3 } from 'web3-utils'

const isDevMode = configs.IS_DEV_MODE
const SELL_PROVIDER = 'MOONPAY'
// Client-side quote lifetime. The purchase API does not return an expiration
// timestamp, so quotes are considered stale this long after they are received.
export const QUOTE_TTL_MS = 30_000
// Cooldown applied on HTTP 429 when the server does not send Retry-After.
const RATE_LIMIT_FALLBACK_MS = 30_000

export interface BuyNetwork {
  chain: string
  name: string
  tokens: PurchaseAsset[]
}

export interface BuyFiat {
  fiat_currency: string
  limits: {
    min: number
    max: number
  }
  payment_methods: string[]
}

export const usePurchaseStore = defineStore('purchase', () => {
  const chainsStore = useChainsStore()
  const { chains: mewChains, selectedChain } = storeToRefs(chainsStore)
  const walletStore = useWalletStore()
  const { isWalletConnected } = storeToRefs(walletStore)

  const purchaseInfo = ref<PurchaseInfo | null>(null)
  const isFetching = ref(false)

  const coinImages = ref<Map<string, string>>(new Map())

  // USD → target currency rates. Used to convert between fiats and compute
  // localized quick-amount presets.
  const exchangeRates = ref<Map<string, number>>(new Map())

  const buyQuotes = ref<BuyQuote[]>([])
  const isFetchingQuotes = ref(false)
  const buyQuotesError = ref('')
  const buyQuotesExpiresAt = ref<number | null>(null)

  const cryptoEstimate = ref('')
  const isFetchingEstimate = ref(false)

  const sellQuote = ref<SellQuote | null>(null)
  const isFetchingSellQuote = ref(false)
  const sellQuoteError = ref('')
  const sellQuoteExpiresAt = ref<number | null>(null)

  // Timestamp until which quote requests are paused after an HTTP 429.
  const rateLimitedUntil = ref<number | null>(null)

  // Monotonic ids so an out-of-order response can never overwrite the state
  // written by a newer request.
  let buyQuotesRequestId = 0
  let buyEstimateRequestId = 0
  let sellQuoteRequestId = 0

  const applyRateLimit = (response: Response) => {
    const retryAfterSeconds = Number(response.headers.get('Retry-After'))
    const delayMs =
      Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
        ? retryAfterSeconds * 1000
        : RATE_LIMIT_FALLBACK_MS
    rateLimitedUntil.value = Date.now() + delayMs
  }

  // Set of v7 chain names supported by MEW. Used to filter the purchase API
  // response to only MEW-supported networks.
  const mewChainNames = computed(
    () => new Set(mewChains.value.map(c => c.name)),
  )

  const isMewSupportedPurchaseChain = (purchaseChain: string): boolean => {
    const v7Name = PURCHASE_CHAIN_TO_V7[purchaseChain]
    return v7Name ? mewChainNames.value.has(v7Name) : false
  }

  const buyableCoinIds = computed(() => {
    if (!purchaseInfo.value?.assets) return new Set<string>()
    const ids = new Set<string>()
    purchaseInfo.value.assets.forEach(chain => {
      if (!isMewSupportedPurchaseChain(chain.chain)) return
      chain.assets?.forEach(asset => {
        if (asset.coingecko_id) {
          ids.add(asset.coingecko_id)
        }
      })
    })
    return ids
  })

  const buyableCompatibleCoinIds = computed(() => {
    if (!purchaseInfo.value?.assets) return new Set<string>()
    const walletType = isWalletConnected.value
      ? selectedChain.value?.type
      : undefined
    const ids = new Set<string>()
    purchaseInfo.value.assets.forEach(chain => {
      if (!isMewSupportedPurchaseChain(chain.chain)) return
      if (walletType) {
        const v7Name = PURCHASE_CHAIN_TO_V7[chain.chain]
        const v7Chain = mewChains.value.find(c => c.name === v7Name)
        if (v7Chain?.type !== walletType) return
      }
      chain.assets?.forEach(asset => {
        if (asset.coingecko_id) {
          ids.add(asset.coingecko_id)
        }
      })
    })
    return ids
  })

  const buyNetworks = computed<BuyNetwork[]>(() => {
    if (!purchaseInfo.value?.assets) return []
    return purchaseInfo.value.assets
      .filter(chain => isMewSupportedPurchaseChain(chain.chain))
      .map(chain => ({
        chain: chain.chain,
        name: chain.name,
        tokens: chain.assets,
      }))
  })

  const sellNetworks = computed<BuyNetwork[]>(() => {
    if (!purchaseInfo.value?.assets) return []
    return purchaseInfo.value.assets
      .filter(chain => isMewSupportedPurchaseChain(chain.chain))
      .map(chain => ({
        chain: chain.chain,
        name: chain.name,
        tokens: chain.assets.filter(asset => asset.is_sell_supported),
      }))
      .filter(chain => chain.tokens.length > 0)
  })

  const buyFiats = computed<Map<string, BuyFiat>>(() => {
    const fiatsMap = new Map<string, BuyFiat>()
    if (!purchaseInfo.value?.providers) return fiatsMap
    purchaseInfo.value.providers.forEach(provider => {
      provider.fiats.forEach(fiat => {
        const existing = fiatsMap.get(fiat.fiat_currency)
        if (existing) {
          existing.limits = {
            max: Math.max(existing.limits.max, fiat.limits.max),
            min: Math.min(existing.limits.min, fiat.limits.min),
          }
        } else {
          fiatsMap.set(fiat.fiat_currency, {
            fiat_currency: fiat.fiat_currency,
            limits: { ...fiat.limits },
            payment_methods: [...fiat.payment_methods],
          })
        }
      })
    })
    return fiatsMap
  })

  const sellFiats = computed<Map<string, BuyFiat>>(() => {
    const fiatsMap = new Map<string, BuyFiat>()
    const provider = purchaseInfo.value?.providers?.find(
      p => p.provider === SELL_PROVIDER,
    )
    if (!provider) return fiatsMap
    provider.fiats.forEach(fiat => {
      if (!fiat.is_sell_supported) return
      fiatsMap.set(fiat.fiat_currency, {
        fiat_currency: fiat.fiat_currency,
        limits: { ...fiat.limits },
        payment_methods: [...fiat.payment_methods],
      })
    })
    return fiatsMap
  })

  const fetchCoinImages = async (coinIds: string[]) => {
    if (coinIds.length === 0) return
    const { useMEWFetch } = useFetchMewApi()
    try {
      const { data } = await useMEWFetch('/v1/coins/images')
        .post({ coinIds })
        .json<Record<string, { url: string | null; marketCap: number | null }>>()
      const response = data.value
      if (!response) return
      const map = new Map<string, string>()
      Object.entries(response).forEach(([id, entry]) => {
        if (entry?.url) map.set(id, entry.url)
      })
      coinImages.value = map
    } catch (error) {
      if (isDevMode) {
        console.error('Failed to fetch coin images:', error)
      }
    }
  }

  const fetchExchangeRates = async () => {
    if (exchangeRates.value.size > 0) return
    try {
      const response = await fetch(configs.MEW_EXCHANGE_RATES_API)
      if (!response.ok) return
      const data: Array<{ fiat_currency: string; exchange_rate: string }> =
        await response.json()
      const map = new Map<string, number>()
      data.forEach(({ fiat_currency, exchange_rate }) => {
        const rate = Number(exchange_rate)
        if (Number.isFinite(rate) && rate > 0) {
          map.set(fiat_currency, rate)
        }
      })
      exchangeRates.value = map
    } catch (error) {
      if (isDevMode) {
        console.error('Failed to fetch exchange rates:', error)
      }
    }
  }

  const fetchPurchaseInfo = async () => {
    if (purchaseInfo.value || isFetching.value) return
    isFetching.value = true
    const { useMEWFetch } = useFetchMewApi()
    try {
      const url = `${configs.MEW_PURCHASE_API}?includeMarketData=true`
      const [{ data }] = await Promise.all([
        useMEWFetch(url).get().json<PurchaseInfo>(),
        fetchExchangeRates(),
      ])
      purchaseInfo.value = data.value
      const ids = Array.from(buyableCoinIds.value)
      fetchCoinImages(ids)
    } catch (error) {
      if (isDevMode) {
        console.error('Failed to fetch purchase info:', error)
      }
    } finally {
      isFetching.value = false
    }
  }

  const fetchBuyQuotes = async (
    params: FetchBuyQuotesParams,
    options?: { silent?: boolean },
  ) => {
    const requestId = ++buyQuotesRequestId
    isFetchingQuotes.value = true
    // Silent refreshes keep the current quotes visible until the new ones
    // arrive, instead of flashing the loading state.
    if (!options?.silent) {
      buyQuotesError.value = ''
      buyQuotes.value = []
      buyQuotesExpiresAt.value = null
    }
    const id = sha3(params.address)?.substring(0, 42)
    const urlParams = new URLSearchParams(window.location.search)
    const platform = urlParams.get('platform') || 'web'
    const queryParams = new URLSearchParams({
      id: id || '',
      address: params.address,
      fiatCurrency: params.fiatCurrency,
      amount: params.amount,
      cryptoCurrency: params.cryptoCurrency,
      chain: params.chain,
      iso: params.iso || 'US',
      platform,
    })
    const url = `${configs.MEW_PURCHASE_BASE_URL}/v5/purchase/buy?${queryParams.toString()}`
    try {
      const response = await fetch(url)
      if (requestId !== buyQuotesRequestId) return
      if (response.status === 429) {
        applyRateLimit(response)
        // On the initial (non-silent) request there is no quote left on
        // screen, so surface the rate limit as an error.
        if (!options?.silent) {
          buyQuotesError.value = 'Too many requests. Please try again shortly.'
        }
        return
      }
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        if (requestId !== buyQuotesRequestId) return
        buyQuotesError.value =
          errBody.msg || errBody.error || `Request failed: ${response.status}`
        return
      }
      const data = await response.json()
      if (requestId !== buyQuotesRequestId) return
      if (data.msg || data.error) {
        buyQuotesError.value = data.msg || data.error
        return
      }
      buyQuotes.value = data as BuyQuote[]
      buyQuotesExpiresAt.value = buyQuotes.value.length
        ? Date.now() + QUOTE_TTL_MS
        : null
      buyQuotesError.value = ''
      rateLimitedUntil.value = null
    } catch (error) {
      if (requestId !== buyQuotesRequestId) return
      if (isDevMode) {
        console.error('Failed to fetch buy quotes:', error)
      }
      buyQuotesError.value = 'Failed to fetch quotes'
    } finally {
      if (requestId === buyQuotesRequestId) {
        isFetchingQuotes.value = false
      }
    }
  }

  const clearBuyQuotes = () => {
    buyQuotesRequestId++
    buyQuotes.value = []
    buyQuotesError.value = ''
    buyQuotesExpiresAt.value = null
    isFetchingQuotes.value = false
  }

  const fetchBuyEstimate = async (params: {
    fiatCurrency: string
    amount: string
    cryptoCurrency: string
    chain: string
  }) => {
    const requestId = ++buyEstimateRequestId
    isFetchingEstimate.value = true
    const queryParams = new URLSearchParams({
      fiatCurrency: params.fiatCurrency,
      amount: params.amount,
      cryptoCurrency: params.cryptoCurrency,
      chain: params.chain,
    })
    const url = `${configs.MEW_PURCHASE_BASE_URL}/v5/purchase/quote?${queryParams.toString()}`
    try {
      const response = await fetch(url)
      if (requestId !== buyEstimateRequestId) return
      if (response.status === 429) {
        applyRateLimit(response)
        cryptoEstimate.value = ''
        return
      }
      const data = await response.json()
      if (requestId !== buyEstimateRequestId) return
      cryptoEstimate.value = data?.[0]?.crypto_amount ?? ''
    } catch (error) {
      if (requestId !== buyEstimateRequestId) return
      if (isDevMode) {
        console.error('Failed to fetch buy estimate:', error)
      }
      cryptoEstimate.value = ''
    } finally {
      if (requestId === buyEstimateRequestId) {
        isFetchingEstimate.value = false
      }
    }
  }

  const clearBuyEstimate = () => {
    buyEstimateRequestId++
    cryptoEstimate.value = ''
    isFetchingEstimate.value = false
  }

  const fetchSellQuote = async (
    params: FetchSellQuoteParams,
    options?: { silent?: boolean },
  ) => {
    const requestId = ++sellQuoteRequestId
    isFetchingSellQuote.value = true
    // Silent refreshes keep the current quote visible until the new one
    // arrives, instead of flashing the loading state.
    if (!options?.silent) {
      sellQuoteError.value = ''
      sellQuote.value = null
      sellQuoteExpiresAt.value = null
    }
    const id = sha3(params.address)?.substring(0, 42)
    const urlParams = new URLSearchParams(window.location.search)
    const platform = urlParams.get('platform') || 'web'
    const queryParams = new URLSearchParams({
      id: id || '',
      address: params.address,
      fiatCurrency: params.fiatCurrency,
      amount: params.amount,
      cryptoCurrency: params.cryptoCurrency,
      chain: params.chain,
      platform,
    })
    const url = `${configs.MEW_PURCHASE_BASE_URL}/v5/purchase/sell?${queryParams.toString()}`
    try {
      const response = await fetch(url)
      if (requestId !== sellQuoteRequestId) return
      if (response.status === 429) {
        applyRateLimit(response)
        // On the initial (non-silent) request there is no quote left on
        // screen, so surface the rate limit as an error.
        if (!options?.silent) {
          sellQuoteError.value = 'Too many requests. Please try again shortly.'
        }
        return
      }
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        if (requestId !== sellQuoteRequestId) return
        sellQuoteError.value =
          errBody.msg || errBody.error || `Request failed: ${response.status}`
        return
      }
      const data = await response.json()
      if (requestId !== sellQuoteRequestId) return
      if (data.msg || data.error) {
        sellQuoteError.value = data.msg || data.error
        return
      }
      const quotes = data as SellQuote[]
      sellQuote.value = quotes[0] ?? null
      sellQuoteExpiresAt.value = sellQuote.value
        ? Date.now() + QUOTE_TTL_MS
        : null
      sellQuoteError.value = ''
      rateLimitedUntil.value = null
    } catch (error) {
      if (requestId !== sellQuoteRequestId) return
      if (isDevMode) {
        console.error('Failed to fetch sell quote:', error)
      }
      sellQuoteError.value = 'Failed to fetch quote'
    } finally {
      if (requestId === sellQuoteRequestId) {
        isFetchingSellQuote.value = false
      }
    }
  }

  const clearSellQuote = () => {
    sellQuoteRequestId++
    sellQuote.value = null
    sellQuoteError.value = ''
    sellQuoteExpiresAt.value = null
    isFetchingSellQuote.value = false
  }

  const isBuyable = (coinId: string | undefined): boolean => {
    if (!coinId) return false
    return buyableCoinIds.value.has(coinId)
  }

  const isBuyableOnCompatibleChain = (coinId: string | undefined): boolean => {
    if (!coinId) return false
    return buyableCompatibleCoinIds.value.has(coinId)
  }

  return {
    purchaseInfo,
    isFetching,
    coinImages,
    exchangeRates,
    fetchExchangeRates,
    buyableCoinIds,
    fetchPurchaseInfo,
    isBuyable,
    isBuyableOnCompatibleChain,
    buyNetworks,
    buyFiats,
    buyQuotes,
    isFetchingQuotes,
    buyQuotesError,
    buyQuotesExpiresAt,
    fetchBuyQuotes,
    clearBuyQuotes,
    cryptoEstimate,
    isFetchingEstimate,
    fetchBuyEstimate,
    clearBuyEstimate,
    sellNetworks,
    sellFiats,
    sellQuote,
    isFetchingSellQuote,
    sellQuoteError,
    sellQuoteExpiresAt,
    fetchSellQuote,
    clearSellQuote,
    rateLimitedUntil,
  }
})
