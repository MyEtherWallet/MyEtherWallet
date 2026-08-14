import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'

const { toastSpy } = vi.hoisted(() => ({ toastSpy: vi.fn() }))

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
  default: { captureException: () => {}, setTag: () => {} },
  captureException: () => {},
  setTag: () => {},
}))
vi.mock('@/stores/stocksStore', () => ({
  useStocksStore: () => ({
    stocksBalances: [],
    allStocks: [],
  }),
}))
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({
    selectedChain: ref({ name: 'ETH', type: 'EVM' }),
    chains: [],
  }),
}))
vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => ({
    addToastMessage: toastSpy,
    showToast: () => {},
  }),
}))
vi.mock('@/stores/watchOnlyStore', () => ({
  useWatchOnlyStore: () => ({
    watchOnlyAddresses: { EVM: [], BITCOIN: [] },
    isWatchOnly: false,
    addWallet: () => {},
    recordConnection: () => {},
  }),
}))

import { useWalletStore } from '@/stores/walletStore'

beforeEach(() => {
  setActivePinia(createPinia())
  toastSpy.mockClear()
})

describe('walletStore detectedAddress', () => {
  it('setDetectedAddress / clearDetectedAddress manage the field', () => {
    const s = useWalletStore()
    expect(s.detectedAddress).toBeNull()
    s.setDetectedAddress('0xDEADBEEF')
    expect(s.detectedAddress).toBe('0xDEADBEEF')
    s.clearDetectedAddress()
    expect(s.detectedAddress).toBeNull()
  })

  it('fires a persistent info toast when a real connection is over the cap (unsaved)', async () => {
    // watchOnlyStore mock keeps an empty bucket, so the connected address is never
    // "saved" → the cap branch fires. The toast must be Info + non-dismissable.
    const s = useWalletStore()
    const fakeWallet = {
      getAddress: async () => '0xNEWADDRESS',
      getWalletType: () => 'INJECTED',
      getBalance: async () => [],
    }
    await s.setWallet(fakeWallet as never, 'MetaMask', 'software' as never)
    await vi.waitFor(() => expect(toastSpy).toHaveBeenCalled())
    const arg = toastSpy.mock.calls.at(-1)![0]
    expect(arg.type).toBe('info')
    expect(arg.isInfinite).toBe(true)
  })
})
