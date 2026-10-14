import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import type { Chain, ChainType, TokenBalancesRaw } from '@/mew_api/types'

// Mock the network layer so getBalance never hits the wire and we can assert
// whether a request was issued at all.
const fetchWithRetryMock = vi.fn()
vi.mock('@/mew_api/fetchWithRetry', () => ({
  fetchWithRetry: (...args: unknown[]) => fetchWithRetryMock(...args),
}))

// The analytics module transitively pulls in the hardware-wallet SDK, which is
// unavailable in the unit-test environment. Stub it so importing the stores
// under test does not resolve that native dependency.
vi.mock('@/analytics', () => ({
  analytics: {
    setNetwork: vi.fn(),
    setWalletStatus: vi.fn(),
    setWalletName: vi.fn(),
    setWalletType: vi.fn(),
    setUserProperties: vi.fn(),
  },
}))

import WatchOnlyWallet from '@/providers/common/watchOnlyWallet'
import { useChainsStore } from '@/stores/chainsStore'
import { useGlobalStore } from '@/stores/globalStore'
import { WalletType } from '@/providers/types'

const EVM_ADDRESS = '0x1234567890123456789012345678901234567890'
const BTC_ADDRESS = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4'

const makeChain = (name: string, type: ChainType): Chain =>
  ({ name, type, chainID: name === 'ETHEREUM' ? '1' : '0' }) as unknown as Chain

const BTC_CHAIN = makeChain('BITCOIN', 'BITCOIN')
const ETH_CHAIN = makeChain('ETHEREUM', 'EVM')

const selectChain = (chain: Chain) => {
  const chainsStore = useChainsStore()
  const globalStore = useGlobalStore()
  chainsStore.setChainData([BTC_CHAIN, ETH_CHAIN])
  globalStore.setSelectedNetwork(chain.name)
}

describe('WatchOnlyWallet.getBalance address/chain-type guard (MEW-2043)', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    fetchWithRetryMock.mockReset()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('does NOT issue a balance request for an EVM address paired with a BITCOIN chain', async () => {
    selectChain(BTC_CHAIN)
    const wallet = new WatchOnlyWallet(
      EVM_ADDRESS,
      BTC_CHAIN,
      WalletType.INJECTED,
      'BITCOIN',
      'watch-only',
    )

    const result = await wallet.getBalance()

    expect(fetchWithRetryMock).not.toHaveBeenCalled()
    expect(result).toEqual<TokenBalancesRaw>({ result: [] })
  })

  it('does NOT issue a balance request for a bitcoin address paired with an EVM chain', async () => {
    selectChain(ETH_CHAIN)
    const wallet = new WatchOnlyWallet(
      BTC_ADDRESS,
      ETH_CHAIN,
      WalletType.INJECTED,
      'EVM',
      'watch-only',
    )

    const result = await wallet.getBalance()

    expect(fetchWithRetryMock).not.toHaveBeenCalled()
    expect(result).toEqual<TokenBalancesRaw>({ result: [] })
  })

  it('DOES issue a balance request when a bitcoin address matches a BITCOIN chain', async () => {
    selectChain(BTC_CHAIN)
    fetchWithRetryMock.mockResolvedValue({ result: [] })
    const wallet = new WatchOnlyWallet(
      BTC_ADDRESS,
      BTC_CHAIN,
      WalletType.INJECTED,
      'BITCOIN',
      'watch-only',
    )

    await wallet.getBalance()

    expect(fetchWithRetryMock).toHaveBeenCalledTimes(1)
    expect(fetchWithRetryMock).toHaveBeenCalledWith(
      expect.stringContaining(`/balances/BITCOIN/${BTC_ADDRESS}/`),
    )
  })

  it('DOES issue a balance request when an EVM address matches an EVM chain', async () => {
    selectChain(ETH_CHAIN)
    fetchWithRetryMock.mockResolvedValue({ result: [] })
    const wallet = new WatchOnlyWallet(
      EVM_ADDRESS,
      ETH_CHAIN,
      WalletType.INJECTED,
      'EVM',
      'watch-only',
    )

    await wallet.getBalance()

    expect(fetchWithRetryMock).toHaveBeenCalledTimes(1)
    expect(fetchWithRetryMock).toHaveBeenCalledWith(
      expect.stringContaining(`/balances/ETHEREUM/${EVM_ADDRESS}/`),
    )
  })

  it('resolves safely (no unhandled rejection) when the balance request rejects', async () => {
    selectChain(BTC_CHAIN)
    fetchWithRetryMock.mockRejectedValue(new Error('Invalid Bitcoin address'))
    const wallet = new WatchOnlyWallet(
      BTC_ADDRESS,
      BTC_CHAIN,
      WalletType.INJECTED,
      'BITCOIN',
      'watch-only',
    )

    await expect(wallet.getBalance()).resolves.toEqual({
      result: [],
    } satisfies TokenBalancesRaw)
  })
})
