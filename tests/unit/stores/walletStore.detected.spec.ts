import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/modules/trade/composables', () => ({
  useMarketStatus: () => ({ isTradingRestrictedInRegion: { value: false } }),
}))
vi.mock('@/modules/trade/providers/ondoHelpers', () => ({
  checkAddressRestriction: async () => false,
}))
vi.mock('@/analytics', () => ({
  analytics: new Proxy({}, { get: () => () => {} }),
  WalletStatus: {}, BalanceBracket: {},
}))
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: { SOFTWARE: 'software', EXTENSION: 'extension', HARDWARE: 'hardware' },
  walletConfigs: {},
}))
vi.mock('@sentry/vue', () => ({
  default: { captureException: () => {} },
  captureException: () => {},
}))
vi.mock('@/stores/stocksStore', () => ({
  useStocksStore: () => ({
    stocksBalances: [],
    allStocks: [],
  }),
}))
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({
    selectedChain: { name: 'ETH', type: 'EVM' },
    chains: [],
  }),
}))
vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => ({
    showToast: () => {},
  }),
}))
vi.mock('@/stores/watchOnlyStore', () => ({
  useWatchOnlyStore: () => ({
    watchOnlyAddresses: { EVM: [] },
    isWatchOnly: false,
  }),
}))

import { useWalletStore } from '@/stores/walletStore'

beforeEach(() => setActivePinia(createPinia()))

describe('walletStore detectedAddress', () => {
  it('setDetectedAddress / clearDetectedAddress manage the field', () => {
    const s = useWalletStore()
    expect(s.detectedAddress).toBeNull()
    s.setDetectedAddress('0xDEADBEEF')
    expect(s.detectedAddress).toBe('0xDEADBEEF')
    s.clearDetectedAddress()
    expect(s.detectedAddress).toBeNull()
  })
})
