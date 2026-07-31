import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'

const { swapperConstructor, getRestrictedTokenAddresses, initPromiseQueue } =
  vi.hoisted(() => ({
    swapperConstructor: vi.fn(),
    getRestrictedTokenAddresses: vi.fn().mockResolvedValue([]),
    initPromiseQueue: [] as Promise<void>[],
  }))

vi.mock('@enkryptcom/swap', () => {
  class MockSwapper {
    initPromise = initPromiseQueue.shift() ?? Promise.resolve()

    constructor(options: unknown) {
      swapperConstructor(options)
    }

    getFromTokens() {
      return {
        all: [
          {
            address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            symbol: 'ETH',
            decimals: 18,
            price: 0,
          },
          {
            address: '0xabc',
            symbol: 'ABC',
            decimals: 18,
            price: 2,
          },
        ],
      }
    }

    getToTokens() {
      const restrictedToken = {
        address: '0xabc',
        symbol: 'ABC',
        decimals: 18,
        price: 2,
      }
      return {
        top: { ETHEREUM: [restrictedToken] },
        trending: { ETHEREUM: [restrictedToken] },
        all: { ETHEREUM: [restrictedToken] },
      }
    }

    getQuotes() {
      return Promise.resolve([])
    }

    getSwap() {
      return Promise.resolve(null)
    }
  }

  return {
    default: MockSwapper,
    WalletIdentifier: { mew: 'mew' },
    isSupportedNetwork: () => true,
  }
})

vi.mock('web3-eth', () => ({ default: vi.fn() }))

vi.mock('@/providers/ethereum/chainToEnum', () => ({
  supportedSwapEnums: { ETHEREUM: 'ETHEREUM', BSC: 'BSC' },
  enumToChain: { ETHEREUM: 'ETHEREUM', BSC: 'BSC' },
}))

vi.mock('@/modules/trade/providers/ondoHelpers', () => ({
  getRestrictedTokenAddresses,
}))

vi.mock('@/i18n', () => ({
  default: { global: { t: (key: string) => key } },
}))

vi.mock('@/stores/chainsStore', async () => {
  const { defineStore } = await import('pinia')
  const { ref } = await import('vue')
  return {
    useChainsStore: defineStore('chainsStore', () => ({
      selectedChain: ref<MockChain>(),
      allChains: ref<MockChain[]>([]),
      swapChains: ref<MockChain[]>([]),
    })),
  }
})

vi.mock('@/stores/globalStore', async () => {
  const { defineStore } = await import('pinia')
  const { ref } = await import('vue')
  return {
    useGlobalStore: defineStore('global', () => ({
      selectedNetwork: ref(''),
      isTradingRestrictedInRegion: ref(true),
    })),
  }
})

vi.mock('@/stores/walletStore', async () => {
  const { defineStore } = await import('pinia')
  const { ref } = await import('vue')
  return {
    MAIN_TOKEN_CONTRACT: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    useWalletStore: defineStore('walletStore', () => ({
      tokens: ref<MockWalletToken[]>([]),
      balanceWei: ref('0'),
      isWalletConnected: ref(false),
    })),
  }
})

vi.mock('@/stores/toastStore', async () => {
  const { defineStore } = await import('pinia')
  return {
    useToastStore: defineStore('toastStore', () => ({
      addToastMessage: vi.fn(),
    })),
  }
})

import { useChainsStore } from '@/stores/chainsStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useWalletStore } from '@/stores/walletStore'
import { useSwapStore } from '@/stores/swapStore'

interface MockChain {
  name: string
  rpcUrls: string[]
  price: number
}

interface MockWalletToken {
  contract: string
  balanceWei: string
  price?: number
}

const ethereum = { name: 'ETHEREUM', rpcUrls: ['https://rpc'], price: 3 }
const bsc = { name: 'BSC', rpcUrls: ['https://bsc-rpc'], price: 1 }

const settleStore = async () => {
  await nextTick()
  await vi.waitFor(() => expect(useSwapStore().swapLoaded).toBe(true))
}

describe('useSwapStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    swapperConstructor.mockClear()
    getRestrictedTokenAddresses.mockClear()
    initPromiseQueue.length = 0
  })

  it('returns one Pinia store instance per active Pinia', () => {
    expect(useSwapStore()).toBe(useSwapStore())
  })

  it('deduplicates concurrent initialization calls', async () => {
    const chainsStore = useChainsStore()
    chainsStore.allChains = [ethereum]
    chainsStore.selectedChain = ethereum
    const swapStore = useSwapStore()

    await Promise.all([swapStore.initSwapper(), swapStore.initSwapper()])

    expect(swapperConstructor).toHaveBeenCalledTimes(1)
    expect(getRestrictedTokenAddresses).toHaveBeenCalledTimes(1)
    expect(swapStore.swapLoaded).toBe(true)
  })

  it('rehydrates token balances without fetching swap lists again', async () => {
    const chainsStore = useChainsStore()
    const walletStore = useWalletStore()
    chainsStore.allChains = [ethereum]
    chainsStore.selectedChain = ethereum
    const swapStore = useSwapStore()
    await settleStore()

    walletStore.tokens = [{ contract: '0xabc', balanceWei: '42', price: 5 }]
    walletStore.balanceWei = '100'
    await nextTick()

    expect(swapStore.fromTokens).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ symbol: 'ETH', balance: '100', price: 3 }),
        expect.objectContaining({ symbol: 'ABC', balance: '42', price: 2 }),
      ]),
    )
    expect(swapperConstructor).toHaveBeenCalledTimes(1)
  })

  it('reinitializes when the selected network changes', async () => {
    const chainsStore = useChainsStore()
    chainsStore.allChains = [ethereum, bsc]
    chainsStore.selectedChain = ethereum
    useSwapStore()
    await settleStore()

    chainsStore.selectedChain = bsc
    await vi.waitFor(() => expect(swapperConstructor).toHaveBeenCalledTimes(2))

    expect(swapperConstructor).toHaveBeenLastCalledWith(
      expect.objectContaining({ network: 'BSC' }),
    )
  })

  it('restores restricted tokens when a cold load resolves as unrestricted', async () => {
    getRestrictedTokenAddresses.mockResolvedValueOnce(['0xabc'])
    const chainsStore = useChainsStore()
    const globalStore = useGlobalStore()
    chainsStore.allChains = [ethereum]
    chainsStore.selectedChain = ethereum
    const swapStore = useSwapStore()
    await settleStore()

    expect(swapStore.fromTokens?.map(token => token.symbol)).toEqual(['ETH'])
    expect(swapStore.toTokens?.all.ETHEREUM).toEqual([])

    globalStore.isTradingRestrictedInRegion = false
    await nextTick()

    expect(swapStore.fromTokens?.map(token => token.symbol)).toEqual([
      'ETH',
      'ABC',
    ])
    expect(swapStore.toTokens?.all.ETHEREUM).toEqual([
      expect.objectContaining({ symbol: 'ABC' }),
    ])
    expect(swapperConstructor).toHaveBeenCalledTimes(1)
  })

  it('initializes the latest network after a change during an in-flight init', async () => {
    let resolveFirstInit: () => void = () => undefined
    initPromiseQueue.push(
      new Promise<void>(resolve => {
        resolveFirstInit = resolve
      }),
    )
    const chainsStore = useChainsStore()
    chainsStore.allChains = [ethereum, bsc]
    chainsStore.selectedChain = ethereum
    useSwapStore()

    chainsStore.selectedChain = bsc
    await nextTick()
    resolveFirstInit()

    await vi.waitFor(() => expect(swapperConstructor).toHaveBeenCalledTimes(2))
    expect(swapperConstructor.mock.calls.map(([options]) => options)).toEqual([
      expect.objectContaining({ network: 'ETHEREUM' }),
      expect.objectContaining({ network: 'BSC' }),
    ])
  })
})
