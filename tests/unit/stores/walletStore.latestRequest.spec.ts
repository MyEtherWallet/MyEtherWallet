// Setting a wallet waits on the network (the address screening) before it
// takes effect. These tests hold that answer back, so that requests overlap
// the way they do on a slow connection, with the real wallet and
// saved-address stores.
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'

/** The screenings still waiting for their answer, oldest first. */
const screenings = vi.hoisted(() => ({
  waiting: [] as Array<(restricted: boolean) => void>,
}))

vi.mock('@/modules/trade/composables', () => ({
  useMarketStatus: () => ({ isTradingRestrictedInRegion: { value: false } }),
}))
vi.mock('@/modules/trade/providers/ondoHelpers', () => ({
  checkAddressRestriction: () =>
    new Promise<boolean>(resolve => screenings.waiting.push(resolve)),
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

import WatchOnlyWallet from '@/providers/common/watchOnlyWallet'
import { useWalletStore } from '@/stores/walletStore'
import { useWatchOnlyStore } from '@/stores/watchOnlyStore'

const FIRST = '0x1111111111111111111111111111111111111111'
const SECOND = '0x2222222222222222222222222222222222222222'
const CHAIN = { name: 'ETHEREUM', type: 'EVM', chainID: '1' }

const watchOnly = (address: string) =>
  new WatchOnlyWallet(
    address,
    CHAIN as never,
    'WATCH_ONLY' as never,
    'EVM' as never,
    'Saved',
  )
const view = (address: string) =>
  useWalletStore().setWallet(watchOnly(address), 'Saved', 'software' as never)
const savedAddresses = () =>
  (useWatchOnlyStore().allAccounts as Array<{ address: string }>).map(account =>
    account.address.toLowerCase(),
  )
/** Wait until `count` screenings are held back. */
const held = (count: number) =>
  vi.waitFor(() => expect(screenings.waiting).toHaveLength(count))
const settle = () => new Promise(resolve => setTimeout(resolve, 20))

describe('walletStore, when requests to set the wallet overlap', () => {
  beforeEach(() => {
    localStorage.clear()
    screenings.waiting.length = 0
    setActivePinia(createPinia())
  })

  it('ends on the wallet asked for last, whichever answer comes back last', async () => {
    const store = useWalletStore()
    const first = view(FIRST)
    const second = view(SECOND)
    await held(2)

    // The later request is answered first, the earlier one after it.
    screenings.waiting[1](false)
    await second
    screenings.waiting[0](false)
    await first
    await settle()

    expect(store.walletAddress).toBe(SECOND)
    expect(await store.wallet?.getAddress()).toBe(SECOND)
    // The wallet that was passed over is not saved either.
    expect(savedAddresses()).toEqual([SECOND.toLowerCase()])
  })

  it('stays without a wallet once it was cleared, when an earlier restore answers late', async () => {
    const store = useWalletStore()
    const saved = useWatchOnlyStore()
    saved.tryAddAddress(
      FIRST,
      CHAIN as never,
      'WATCH_ONLY',
      'EVM' as never,
      'Saved',
    )

    // A restore of the saved address is on its way when the address is
    // deleted, which leaves nothing to fall back to.
    const restoring = store.setWatchOnlyIfExist()
    await held(1)
    saved.removeWallet(FIRST, CHAIN as never)
    await store.setWatchOnlyIfExist()
    expect(store.wallet).toBeNull()

    screenings.waiting[0](false)
    await restoring
    await settle()

    expect(store.wallet).toBeNull()
    expect(store.walletAddress).toBeNull()
    expect(savedAddresses()).toEqual([])
  })

  it('counts a request that was passed over as connecting until it has answered', async () => {
    const store = useWalletStore()
    const first = view(FIRST)
    const second = view(SECOND)
    await held(2)

    screenings.waiting[1](false)
    await second
    expect(store.isConnectingWallet).toBe(true)

    screenings.waiting[0](false)
    await first
    expect(store.isConnectingWallet).toBe(false)
  })
})
