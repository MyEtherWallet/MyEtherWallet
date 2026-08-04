import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

// Controllable token-info fetch: the composable calls
// useMEWFetch(url).get().json() and awaits execute(); we drive `data` per test.
const fetchData = ref<unknown>(null)
const execute = vi.fn(async () => {})
vi.mock('@/composables/useFetchMewApi', () => ({
  useFetchMewApi: () => ({
    useMEWFetch: () => ({
      get: () => ({ json: () => ({ data: fetchData, execute }) }),
    }),
  }),
}))

// Ethereum is the only swap-supported chain in these tests.
const chainHasSwapSupport = vi.fn((name: string) => name === 'Ethereum')
const allChains = [{ name: 'Ethereum' }, { name: 'Polygon' }]
let selectedChain: { name: string } | undefined = { name: 'Ethereum' }
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({
    get selectedChain() {
      return selectedChain
    },
    allChains,
    chainHasSwapSupport,
  }),
}))

const storeSwapValues = vi.fn()
vi.mock('@/stores/inputStore', () => ({
  useInputStore: () => ({ storeSwapValues }),
}))

const openPanel = vi.fn()
vi.mock('@/stores/walletMenuStore', () => ({
  useWalletMenuStore: () => ({ openPanel }),
}))

// walletStore pulls in the Ledger module on import; mock to just the sentinel.
vi.mock('@/stores/walletStore', () => ({
  MAIN_TOKEN_CONTRACT: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
}))

import { useNewListingSwap } from '@/modules/home/composables/useNewListingSwap'

describe('useNewListingSwap', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetchData.value = null
    selectedChain = { name: 'Ethereum' }
  })

  it('uses supportedChains from the payload directly, without a lookup', async () => {
    const { openSwapForCoin } = useNewListingSwap()
    await openSwapForCoin('btc', 'BTC', 'Bitcoin', [
      { chainName: 'Ethereum', contract: '0xFED' },
    ])

    expect(execute).not.toHaveBeenCalled()
    expect(storeSwapValues).toHaveBeenCalledWith(
      expect.objectContaining({
        toToken: expect.objectContaining({ address: '0xFED' }),
        toChain: { name: 'Ethereum' },
      }),
    )
    expect(openPanel).toHaveBeenCalledWith('swap')
  })

  it('opens Swap without a lookup when supportedChains is provided but empty', async () => {
    const { openSwapForCoin } = useNewListingSwap()
    await openSwapForCoin('btc', 'BTC', 'Bitcoin', [])

    expect(execute).not.toHaveBeenCalled()
    expect(storeSwapValues).not.toHaveBeenCalled()
    expect(openPanel).toHaveBeenCalledWith('swap')
  })

  it('primes swap with the contract on the selected chain, then opens Swap', async () => {
    fetchData.value = {
      supportedChains: [{ chainName: 'Ethereum', contract: '0xABC' }],
    }
    const { openSwapForCoin } = useNewListingSwap()
    await openSwapForCoin('btc', 'BTC', 'Bitcoin')

    expect(execute).toHaveBeenCalled()
    expect(storeSwapValues).toHaveBeenCalledWith(
      expect.objectContaining({
        toToken: expect.objectContaining({
          address: '0xABC',
          symbol: 'BTC',
          name: 'Bitcoin',
        }),
        toChain: { name: 'Ethereum' },
      }),
    )
    expect(openPanel).toHaveBeenCalledWith('swap')
  })

  it('uses the native sentinel when the chain contract is null', async () => {
    fetchData.value = {
      supportedChains: [{ chainName: 'Ethereum', contract: null }],
    }
    const { openSwapForCoin } = useNewListingSwap()
    await openSwapForCoin('eth', 'ETH', 'Ether')

    expect(storeSwapValues).toHaveBeenCalledWith(
      expect.objectContaining({
        toToken: expect.objectContaining({
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        }),
      }),
    )
  })

  it('falls back to the first swap-supported chain when the selected one is not', async () => {
    selectedChain = { name: 'Polygon' } // not swap-supported here
    fetchData.value = {
      supportedChains: [
        { chainName: 'Polygon', contract: '0x111' },
        { chainName: 'Ethereum', contract: '0x222' },
      ],
    }
    const { openSwapForCoin } = useNewListingSwap()
    await openSwapForCoin('tok', 'TOK', 'Token')

    expect(storeSwapValues).toHaveBeenCalledWith(
      expect.objectContaining({
        toToken: expect.objectContaining({ address: '0x222' }),
        toChain: { name: 'Ethereum' },
      }),
    )
  })

  it('still opens Swap (without priming) when no chain supports swap', async () => {
    fetchData.value = {
      supportedChains: [{ chainName: 'Polygon', contract: '0x111' }],
    }
    const { openSwapForCoin } = useNewListingSwap()
    await openSwapForCoin('tok', 'TOK', 'Token')

    expect(storeSwapValues).not.toHaveBeenCalled()
    expect(openPanel).toHaveBeenCalledWith('swap')
  })

  it('still opens Swap when the lookup fails', async () => {
    execute.mockRejectedValueOnce(new Error('network'))
    const { openSwapForCoin } = useNewListingSwap()
    await openSwapForCoin('tok', 'TOK', 'Token')

    expect(storeSwapValues).not.toHaveBeenCalled()
    expect(openPanel).toHaveBeenCalledWith('swap')
  })
})
