import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import type { Chain, ChainType } from '@/mew_api/types'

// addressUtils (used by the write guard) pulls in globalStore, which
// transitively resolves the hardware-wallet SDK — unavailable under jsdom.
// Stub it as a minimal Pinia store so `storeToRefs` still works; the guard
// passes an explicit chain name so the selectedNetwork fallback is unused.
vi.mock('@/stores/globalStore', async () => {
  const { defineStore } = await import('pinia')
  const { ref } = await import('vue')
  return {
    useGlobalStore: defineStore('global', () => ({
      selectedNetwork: ref(''),
    })),
  }
})

const { useWatchOnlyStore } = await import('@/stores/watchOnlyStore')

const EVM_ADDRESS = '0x1234567890123456789012345678901234567890'
const BTC_ADDRESS = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4'

const makeChain = (name: string, type: ChainType): Chain =>
  ({ name, type }) as unknown as Chain

const BTC_CHAIN = makeChain('BITCOIN', 'BITCOIN')
const ETH_CHAIN = makeChain('ETHEREUM', 'EVM')

describe('watchOnlyStore.addWallet address/chain-type write guard (MEW-2043)', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('does NOT persist an EVM address under a BITCOIN chain', () => {
    const store = useWatchOnlyStore()
    store.addWallet(EVM_ADDRESS, BTC_CHAIN, 'watch-only', 'BITCOIN', 'w')
    expect(store.watchOnlyAddresses.BITCOIN).toEqual([])
  })

  it('does NOT persist a bitcoin address under an EVM chain', () => {
    const store = useWatchOnlyStore()
    store.addWallet(BTC_ADDRESS, ETH_CHAIN, 'watch-only', 'EVM', 'w')
    expect(store.watchOnlyAddresses.EVM).toEqual([])
  })

  it('persists matching address/chain-type pairs', () => {
    const store = useWatchOnlyStore()
    store.addWallet(EVM_ADDRESS, ETH_CHAIN, 'watch-only', 'EVM', 'w')
    store.addWallet(BTC_ADDRESS, BTC_CHAIN, 'watch-only', 'BITCOIN', 'w')
    expect(store.watchOnlyAddresses.EVM.map(e => e.address)).toEqual([
      EVM_ADDRESS,
    ])
    expect(store.watchOnlyAddresses.BITCOIN.map(e => e.address)).toEqual([
      BTC_ADDRESS,
    ])
  })
})
