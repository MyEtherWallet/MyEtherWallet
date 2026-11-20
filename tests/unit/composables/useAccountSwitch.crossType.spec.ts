// Picking a saved account that lives on another type of network, through the
// real account switch and the real wallet and saved-address stores. Picking
// it switches the network, and the wallet store answers a change of network
// type by itself, by falling back to a saved address of that type: two
// requests for the wallet, which the specs of each part alone cannot see.
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('@/modules/trade/composables', () => ({
  useMarketStatus: () => ({ isTradingRestrictedInRegion: { value: false } }),
}))
// The address screening is a network call in the app, and answers like one:
// later.
vi.mock('@/modules/trade/providers/ondoHelpers', () => ({
  checkAddressRestriction: () =>
    new Promise(resolve => setTimeout(() => resolve(false), 30)),
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
vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({ endLoginFor: async () => undefined }),
}))
vi.mock('@/stores/chainsStore', async () => {
  const { defineStore } = await import('pinia')
  const { computed, ref } = await import('vue')
  const chains = [
    { name: 'ETHEREUM', nameLong: 'Ethereum', type: 'EVM', chainID: '1' },
    { name: 'BITCOIN', nameLong: 'Bitcoin', type: 'BITCOIN', chainID: 'btc' },
  ]
  return {
    useChainsStore: defineStore('chainsStoreForCrossType', () => {
      const selectedChain = ref(chains[0])
      return {
        selectedChain,
        chains: ref(chains),
        isEvmChain: computed(() => selectedChain.value.type === 'EVM'),
        isBitcoinChain: computed(() => selectedChain.value.type === 'BITCOIN'),
      }
    }),
  }
})
vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => ({ addToastMessage: () => {}, showToast: () => {} }),
}))
vi.mock('@/mew_api/fetchWithRetry', () => ({
  fetchWithRetry: async () => ({ result: [] }),
}))

import { useAccountSwitch } from '@/composables/useAccountSwitch'
import WatchOnlyWallet from '@/providers/common/watchOnlyWallet'
import { useChainsStore } from '@/stores/chainsStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useWalletStore } from '@/stores/walletStore'
import { useWatchOnlyStore } from '@/stores/watchOnlyStore'

const EVM = {
  name: 'ETHEREUM',
  nameLong: 'Ethereum',
  type: 'EVM',
  chainID: '1',
}
const BITCOIN = {
  name: 'BITCOIN',
  nameLong: 'Bitcoin',
  type: 'BITCOIN',
  chainID: 'btc',
}
const EVM_ADDRESS = '0x1111111111111111111111111111111111111111'
// Two published example addresses (BIP-173).
const FIRST_BITCOIN = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
const SECOND_BITCOIN = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4'

type Saved = { address: string }
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/** Two saved Bitcoin accounts, and a saved Ethereum account as the active one. */
const startOnEthereum = async () => {
  const wallets = useWalletStore()
  const saved = useWatchOnlyStore()
  // In the app the selected network is worked out from the global store's
  // choice; here the chains store is a stand-in, so the choice is passed on.
  const chains = useChainsStore() as unknown as {
    selectedChain: typeof EVM
    chains: (typeof EVM)[]
  }
  ;(
    useGlobalStore() as unknown as {
      setSelectedNetwork: (name: string) => void
    }
  ).setSelectedNetwork = name => {
    chains.selectedChain = chains.chains.find(chain => chain.name === name)!
  }
  for (const address of [FIRST_BITCOIN, SECOND_BITCOIN]) {
    saved.tryAddAddress(
      address,
      BITCOIN as never,
      'WATCH_ONLY',
      'BITCOIN' as never,
      'Saved',
    )
  }
  await wallets.setWallet(
    new WatchOnlyWallet(
      EVM_ADDRESS,
      EVM as never,
      'WATCH_ONLY' as never,
      'EVM' as never,
      'Saved',
    ),
    'Saved',
    'software' as never,
  )
  await vi.waitFor(() => expect(wallets.walletAddress).toBe(EVM_ADDRESS))
  return { wallets, saved }
}
const pick = async (
  saved: ReturnType<typeof useWatchOnlyStore>,
  address: string,
) => {
  const account = (saved.allAccounts as Saved[]).find(
    entry => entry.address === address,
  )
  expect(account).toBeDefined()
  await useAccountSwitch().switchTo(account as never)
  // Whatever else was asked of the wallet store has answered by now.
  await wait(200)
}

describe('picking a saved account on another type of network', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    setActivePinia(createPinia())
  })

  it.each([
    ['the first one saved there', FIRST_BITCOIN],
    ['the last one saved there', SECOND_BITCOIN],
  ])('lands on the account that was picked: %s', async (_which, picked) => {
    const { wallets, saved } = await startOnEthereum()

    await pick(saved, picked)

    expect(wallets.walletAddress).toBe(picked)
    expect(await wallets.wallet?.getAddress()).toBe(picked)
    expect(wallets.isWatchOnly).toBe(true)
  })

  it('lands on each account in turn, with the network left and come back to in between', async () => {
    const { wallets, saved } = await startOnEthereum()

    await pick(saved, SECOND_BITCOIN)
    await pick(saved, EVM_ADDRESS)
    await pick(saved, FIRST_BITCOIN)

    expect(wallets.walletAddress).toBe(FIRST_BITCOIN)
    // Nothing was saved twice or lost on the way.
    expect(
      (saved.allAccounts as Saved[]).map(entry => entry.address).sort(),
    ).toEqual([EVM_ADDRESS, FIRST_BITCOIN, SECOND_BITCOIN].sort())
  })
})
