import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { nextTick, type Ref } from 'vue'

type Chain = { name: string; nameLong: string; type: string }
const chains = vi.hoisted(() => ({ selected: null as unknown as Ref<Chain> }))

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
  WalletConfigType: {
    SOFTWARE: 'software',
    EXTENSION: 'extension',
    HARDWARE: 'hardware',
  },
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
vi.mock('@/stores/chainsStore', async () => {
  const { ref } = await import('vue')
  chains.selected = ref({ name: 'ETH', nameLong: 'Ethereum', type: 'EVM' })
  return {
    useChainsStore: () => ({
      selectedChain: chains.selected,
      // No wallet is connected, so the switch is announced right away.
      isEvmChain: ref(true),
      chains: [],
    }),
  }
})
vi.mock('@/stores/watchOnlyStore', () => ({
  useWatchOnlyStore: () => ({
    watchOnlyAddresses: { EVM: [], BITCOIN: [] },
    isWatchOnly: false,
    addWallet: () => {},
    recordConnection: () => {},
  }),
}))

import { useWalletStore } from '@/stores/walletStore'
import { useToastStore } from '@/stores/toastStore'

const switchTo = async (name: string, nameLong: string) => {
  chains.selected.value = { name, nameLong, type: 'EVM' }
  await nextTick()
  await nextTick()
}

beforeEach(() => setActivePinia(createPinia()))

describe('walletStore network switch toast', () => {
  it('replaces the previous switch toast instead of stacking one per switch', async () => {
    useWalletStore()
    const toasts = useToastStore()

    await switchTo('ARB', 'Arbitrum One')
    await switchTo('MATIC', 'Polygon')
    await switchTo('ARB_NOVA', 'Arbitrum Nova')

    expect(toasts.messages).toHaveLength(1)
    expect(toasts.messages[0].text).toContain('Arbitrum Nova')
  })

  it.each([false, true])(
    'ignores a stale wallet switch result (%s) that settles after a newer switch',
    async staleResult => {
      const store = useWalletStore()
      const toasts = useToastStore()
      let settleFirst!: (ok: boolean) => void
      const changeNetwork = vi
        .fn()
        .mockReturnValueOnce(new Promise(r => (settleFirst = r)))
        .mockResolvedValue(true)
      store.wallet = { changeNetwork } as never

      await switchTo('MATIC', 'Polygon') // wallet still deciding
      await switchTo('ARB', 'Arbitrum One')
      expect(toasts.messages).toHaveLength(1)
      expect(toasts.messages[0].text).toContain('Arbitrum One')

      settleFirst(staleResult)
      await new Promise(r => setTimeout(r))

      expect(toasts.messages).toHaveLength(1)
      expect(toasts.messages[0].type).toBe('success')
      expect(toasts.messages[0].text).toContain('Arbitrum One')
    },
  )

  it('ignores a stale result when the user switches back to the same network', async () => {
    const store = useWalletStore()
    const toasts = useToastStore()
    let settleFirst!: (ok: boolean) => void
    const changeNetwork = vi
      .fn()
      .mockReturnValueOnce(new Promise(r => (settleFirst = r)))
      .mockResolvedValue(true)
    store.wallet = { changeNetwork } as never

    // Polygon (pending) → Arbitrum → Polygon again (succeeds).
    await switchTo('MATIC', 'Polygon')
    await switchTo('ARB', 'Arbitrum One')
    await switchTo('MATIC', 'Polygon')
    expect(toasts.messages[0]).toMatchObject({ type: 'success' })

    // The first Polygon request fails late: same chain name, but stale.
    settleFirst(false)
    await new Promise(r => setTimeout(r))

    expect(toasts.messages).toHaveLength(1)
    expect(toasts.messages[0].type).toBe('success')
    expect(toasts.messages[0].text).toContain('Polygon')
  })
})
