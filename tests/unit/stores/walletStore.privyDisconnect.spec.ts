import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'

vi.mock('@/modules/trade/composables', () => ({
  useMarketStatus: () => ({ isTradingRestrictedInRegion: { value: false } }),
}))
vi.mock('@/modules/trade/providers/ondoHelpers', () => ({
  checkAddressRestriction: async () => false,
}))
vi.mock('@/analytics', () => ({
  analytics: new Proxy({}, { get: () => () => {} }),
  WalletStatus: {},
  BalanceBracket: {},
}))
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: { SOFTWARE: 'software', EXTENSION: 'extension' },
  walletConfigs: {},
}))
vi.mock('@sentry/vue', () => ({
  default: { captureException: () => {}, setTag: () => {} },
  captureException: () => {},
  setTag: () => {},
}))
vi.mock('@/stores/stocksStore', () => ({
  useStocksStore: () => ({ stocksBalances: [], allStocks: [] }),
}))
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({
    selectedChain: ref({ name: 'ETHEREUM', type: 'EVM', chainID: '1' }),
    chains: [],
  }),
}))
vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => ({ addToastMessage: () => {}, showToast: () => {} }),
}))
vi.mock('@/mew_api/fetchWithRetry', () => ({
  fetchWithRetry: async () => ({ result: [] }),
}))

import { useWalletStore } from '@/stores/walletStore'
import PrivyWallet from '@/providers/ethereum/privyWallet'
import WatchOnlyWallet from '@/providers/common/watchOnlyWallet'
import { WalletType } from '@/providers/types'

const ADDRESS = '0x1111111111111111111111111111111111111111'

describe('walletStore with a Privy wallet', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('logs out of Privy and keeps the same address as watch-only on disconnect', async () => {
    const logout = vi.fn(async () => undefined)
    const store = useWalletStore()
    await store.setWallet(
      new PrivyWallet({
        provider: { request: async () => null },
        address: ADDRESS,
        chainId: '1',
        logout,
        loginLost: async () => false,
      }),
      'Privy',
      'software' as never,
    )
    await vi.waitFor(() => expect(store.walletAddress).toBe(ADDRESS))
    expect(store.isWatchOnly).toBe(false)

    store.disconnectWallet()

    await vi.waitFor(() => expect(store.wallet).toBeInstanceOf(WatchOnlyWallet))
    expect(logout).toHaveBeenCalledTimes(1)
    expect(await store.wallet?.getAddress()).toBe(ADDRESS)
    expect(store.wallet?.getWalletType()).toBe(WalletType.PRIVY)
    expect(store.isWatchOnly).toBe(true)
  })
})
