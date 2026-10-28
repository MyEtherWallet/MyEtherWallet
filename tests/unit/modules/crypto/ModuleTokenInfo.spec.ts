import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { createPinia, defineStore, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'

// Controllable stand-in for useMEWFetch. The real composable sets
// `updateDataOnError: true`, so after a non-OK response `data` holds the API
// error body and onFetchResponse never fires.
const data = ref<unknown>(null)
const isFetching = ref(false)
let responseHook: (() => void) | undefined
vi.mock('@/composables/useFetchMewApi', () => ({
  useFetchMewApi: () => ({
    useMEWFetch: () => ({
      get: () => ({
        json: () => ({
          data,
          isFetching,
          onFetchResponse: (cb: () => void) => {
            responseHook = cb
          },
        }),
      }),
    }),
  }),
}))

// walletStore pulls in the Ledger SDK, which breaks test load under jsdom.
vi.mock('@/stores/walletStore', () => ({
  MAIN_TOKEN_CONTRACT: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  useWalletStore: defineStore('wallet', () => ({
    walletAddress: ref('0xabc'),
    isWalletConnected: ref(true),
  })),
}))

const bsc = { name: 'BSC', type: 'EVM', icon: '' }
const ethereum = { name: 'ETHEREUM', type: 'EVM', icon: '' }
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: defineStore('chainsStore', () => ({
    selectedChain: ref(bsc),
    allChains: ref([bsc, ethereum]),
    chainHasSwapSupport: () => true,
  })),
}))

vi.mock('@/composables/useCurrency', () => ({
  useCurrency: () => ({ formatFiat: (v: number) => ({ display: `$${v}` }) }),
}))
vi.mock('@/composables/useAssetDescription', () => ({
  useAssetDescription: () => ({
    description: ref(''),
    isFetchingDescription: ref(false),
  }),
}))
vi.mock('@/stores/watchlistTableStore', () => ({
  useWatchlistStore: () => ({
    isWatchListed: () => false,
    setWatchlistItem: vi.fn(),
  }),
}))

const { default: ModuleTokenInfo } =
  await import('@/modules/crypto/ModuleTokenInfo.vue')
const { useWalletMenuStore } = await import('@/stores/walletMenuStore')
const { useTokenInfoStore } = await import('@/stores/tokenInfoStore')
const { useInputStore } = await import('@/stores/inputStore')

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

const mountModule = () => {
  const errors: unknown[] = []
  shallowMount(ModuleTokenInfo, {
    props: { tokenId: 'Zepe.io' },
    global: {
      plugins: [i18n],
      // Same hook Sentry's Vue integration uses to report `handled: no`.
      config: { errorHandler: err => errors.push(err) },
    },
  })
  return errors
}

describe('ModuleTokenInfo swap/bridge prefill (APP-MEW-WEB-XR / 12B)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    data.value = null
    responseHook = undefined
    localStorage.clear()
    // Portfolio balance row for a token the token-info API doesn't list:
    // TableTokenBalance routes by symbol and stashes the row here.
    useTokenInfoStore().setTokenInfo({
      symbol: 'Zepe.io',
      name: 'Zepe.io',
      contract: '0x1111111111111111111111111111111111111111',
      decimals: 18,
    } as never)
  })

  it('does not crash when the token-info request failed and the panel changes', async () => {
    const errors = mountModule()
    // API answered with an error body (updateDataOnError keeps it in `data`).
    data.value = { message: 'Not Found' }
    await flushPromises()

    const walletMenu = useWalletMenuStore()
    walletMenu.setWalletPanel('bridge') // 12B: setBridgeValues
    await nextTick()
    walletMenu.setWalletPanel('swap') // XR: setSwapWalletStore
    await nextTick()

    expect(errors).toEqual([])
  })

  it('still prefills swap when the token-info request succeeds', async () => {
    const storeSwapValues = vi.spyOn(useInputStore(), 'storeSwapValues')
    mountModule()
    data.value = {
      coinId: 'zepe',
      symbol: 'ZEPE',
      name: 'Zepe',
      supportedChains: [{ chainName: 'BSC', contract: '0x2222' }],
      chainBalances: [
        { chainName: 'BSC', result: { ok: true, value: { decimals: 9 } } },
      ],
    }
    responseHook?.()
    await flushPromises()

    expect(storeSwapValues).toHaveBeenCalledWith(
      expect.objectContaining({
        toToken: expect.objectContaining({ address: '0x2222', decimals: 9 }),
      }),
    )
  })

  it('drops the bridge prefill once a refetch fails', async () => {
    const storeSwapValues = vi.spyOn(useInputStore(), 'storeSwapValues')
    mountModule()
    data.value = {
      coinId: 'zepe',
      symbol: 'ZEPE',
      name: 'Zepe',
      supportedChains: [
        { chainName: 'BSC', contract: '0x2222' },
        { chainName: 'ETHEREUM', contract: '0x3333' },
      ],
      chainBalances: [
        { chainName: 'ETHEREUM', result: { ok: true, value: { decimals: 6 } } },
      ],
    }
    const walletMenu = useWalletMenuStore()
    walletMenu.setWalletPanel('bridge')
    await nextTick()
    expect(storeSwapValues).toHaveBeenCalledWith(
      expect.objectContaining({
        toToken: expect.objectContaining({ address: '0x3333' }),
      }),
    )

    walletMenu.setWalletPanel('swap')
    await nextTick()
    data.value = { message: 'Not Found' }
    await flushPromises()
    storeSwapValues.mockClear()
    walletMenu.setWalletPanel('bridge')
    await nextTick()

    expect(storeSwapValues).not.toHaveBeenCalled()
  })
})
