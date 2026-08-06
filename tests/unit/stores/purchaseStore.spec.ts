import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import type { PurchaseInfo } from '@/types/buyToken'

// purchaseStore instantiates chainsStore and walletStore at setup. The real
// walletStore transitively imports the wallet-provider chain (Ledger / hw
// wallets), which is irrelevant to `sellFiats` and heavy to load under jsdom.
// Stub both with minimal real Pinia setup stores so `storeToRefs` still works.
vi.mock('@/stores/chainsStore', async () => {
  const { defineStore } = await import('pinia')
  const { ref } = await import('vue')
  return {
    useChainsStore: defineStore('chains', () => ({
      chains: ref([]),
      selectedChain: ref(null),
    })),
  }
})
vi.mock('@/stores/walletStore', async () => {
  const { defineStore } = await import('pinia')
  const { ref } = await import('vue')
  return {
    useWalletStore: defineStore('wallet', () => ({
      isWalletConnected: ref(false),
    })),
  }
})

const { usePurchaseStore } = await import('@/stores/purchaseStore')

describe('purchaseStore.sellFiats', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('returns an empty map (no throw) when purchaseInfo is set but has no providers', () => {
    const store = usePurchaseStore()
    // Simulate a malformed / partial purchase API response where the object
    // exists but `providers` is missing. This reproduces APP-MEW-WEB-1DZ:
    // `purchaseInfo.value?.providers.find(...)` threw because the optional
    // chain only guarded `purchaseInfo.value`, not `providers`.
    store.purchaseInfo = { assets: [] } as unknown as PurchaseInfo
    expect(() => store.sellFiats).not.toThrow()
    expect(store.sellFiats.size).toBe(0)
  })

  it('returns an empty map when purchaseInfo is null', () => {
    const store = usePurchaseStore()
    store.purchaseInfo = null
    expect(store.sellFiats.size).toBe(0)
  })

  it('collects sell-supported fiats from the MOONPAY provider', () => {
    const store = usePurchaseStore()
    store.purchaseInfo = {
      assets: [],
      providers: [
        {
          provider: 'MOONPAY',
          isos_list: [],
          isos: [],
          fiats_list: [],
          fiats: [
            {
              fiat_currency: 'USD',
              limits: { min: 10, max: 1000 },
              payment_methods: ['card'],
              is_sell_supported: true,
            },
            {
              fiat_currency: 'GBP',
              limits: { min: 10, max: 1000 },
              payment_methods: ['card'],
              is_sell_supported: false,
            },
          ],
        },
      ],
    } as PurchaseInfo
    expect(store.sellFiats.size).toBe(1)
    expect(store.sellFiats.has('USD')).toBe(true)
    expect(store.sellFiats.has('GBP')).toBe(false)
  })
})
