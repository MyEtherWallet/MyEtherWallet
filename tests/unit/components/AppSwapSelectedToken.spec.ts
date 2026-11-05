import { describe, it, expect, vi, beforeEach } from 'vitest'

// chainsStore pulls the wallet configs, which load Ledger.
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))
vi.mock('@/analytics', () => ({
  analytics: { trackSwapClickSortEvent: vi.fn() },
  SwapClickSortEvent: 'Swap_Click_Sort',
}))
vi.mock('@/stores/stocksStore', async () => {
  const { defineStore } = await import('pinia')
  return {
    useStocksStore: defineStore('stocksStore', () => ({
      isStock: (address: string, chain: string) =>
        address === '0xAAPL' && chain === 'ETHEREUM',
    })),
  }
})
// The real walletStore loads the hw-wallet providers; the wrapper only reads
// these refs.
vi.mock('@/stores/walletStore', async () => {
  const { defineStore } = await import('pinia')
  const { ref } = await import('vue')
  return {
    useWalletStore: defineStore('wallet', () => ({
      isLoadingBalances: ref(false),
      isWalletConnected: ref(true),
      allTokens: ref([
        {
          contract: '0xUSDC',
          market_cap: 70,
          volume_24h: 5,
        },
      ]),
    })),
  }
})

import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import i18n from '@/i18n'
import { analytics } from '@/analytics'
import AppSwapSelectedToken from '@/components/AppSwapSelectedToken.vue'
import AppTokenSelectorModal from '@/components/token_selector/AppTokenSelectorModal.vue'
import type { TokenSelectorItem } from '@/components/token_selector/types'
import { useChainsStore } from '@/stores/chainsStore'
import { useRecentlyViewedTokensStore } from '@/stores/recentlyViewedTokensStore'
import type { Chain } from '@/mew_api/types'
import type { NewTokenInfo } from '@/stores/swapStore'

const token = (
  symbol: string,
  address: string,
  extra: Partial<NewTokenInfo> = {},
) =>
  ({
    symbol,
    address,
    name: `${symbol} name`,
    decimals: 18,
    logoURI: `${symbol}.png`,
    price: 1,
    ...extra,
  }) as NewTokenInfo

const TOKENS = [
  // Same symbol, no rank: the quick pick must take the ranked USDC.
  token('USDC', '0xFAKE'),
  token('ETH', '0xEEE', {
    rank: 1,
    price: 3000,
    balance: '1000000000000000000',
  }),
  token('USDC', '0xUSDC', { rank: 2, cgId: 'usd-coin' }),
  token('USDT', '0xUSDT', { rank: 3 }),
  token('DAI', '0xDAI', { rank: 4 }),
  token('WBTC', '0xWBTC', { rank: 5, price: 60000, cgId: 'wrapped-bitcoin' }),
]

const mountWrapper = (props: Record<string, unknown> = {}) =>
  mount(AppSwapSelectedToken, {
    props: {
      chainTokens: TOKENS,
      networkName: 'ETHEREUM',
      isFromView: false,
      ...props,
    },
    global: {
      plugins: [i18n],
      stubs: { AppTokenSelectorModal: true, AppPicker: true },
    },
  })

const modalOf = (wrapper: ReturnType<typeof mountWrapper>) =>
  wrapper.getComponent(AppTokenSelectorModal)

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
  useChainsStore().setChainData([
    {
      name: 'ETHEREUM',
      nameLong: 'Ethereum',
      currencyName: 'ETH',
      icon: 'eth-chain.svg',
      type: 'EVM',
    } as Chain,
  ])
  vi.mocked(analytics.trackSwapClickSortEvent).mockClear()
})

describe('AppSwapSelectedToken', () => {
  it('maps tokens to rows: holdings, then the price', () => {
    const items = modalOf(mountWrapper()).props('items') as TokenSelectorItem[]
    const byId = Object.fromEntries(items.map(item => [item.id, item]))

    expect(byId['0xEEE'].rightAccessory).toEqual({
      kind: 'balance',
      primary: expect.stringContaining('3,000'),
      secondary: '1 ETH',
    })
    expect(byId['0xUSDC'].rightAccessory).toEqual({
      kind: 'balance',
      primary: expect.stringContaining('1'),
    })
    expect(byId['0xWBTC'].rightAccessory).toEqual({
      kind: 'balance',
      primary: expect.stringContaining('60,000'),
    })
    expect(byId['0xWBTC']).toMatchObject({
      symbol: 'WBTC',
      name: 'WBTC name',
      logo: 'WBTC.png',
    })
  })

  it('shows the from-side balance for every token once connected', () => {
    const items = modalOf(mountWrapper({ isFromView: true })).props(
      'items',
    ) as TokenSelectorItem[]
    expect(items.find(item => item.id === '0xWBTC')?.rightAccessory).toEqual({
      kind: 'balance',
      primary: expect.stringContaining('0'),
      secondary: '0 WBTC',
    })
  })

  it('builds the quick picks from the chain native symbol, best rank first', () => {
    const modal = modalOf(mountWrapper())
    const picks = modal.props('quickPicks') as TokenSelectorItem[]
    expect(picks.map(item => item.id)).toEqual([
      '0xUSDC',
      '0xWBTC',
      '0xEEE',
      '0xUSDT',
    ])
    expect(modal.props('networkIcon')).toBe('eth-chain.svg')
  })

  it('turns recently viewed entries into rows of this chain', () => {
    useRecentlyViewedTokensStore().addToken({
      id: 'wrapped-bitcoin',
      symbol: 'WBTC',
      name: 'WBTC name',
    })
    const recent = modalOf(mountWrapper()).props(
      'recentItems',
    ) as TokenSelectorItem[]
    expect(recent.map(item => item.id)).toEqual(['0xWBTC'])
  })

  it('draws tokenized stocks with the Stocks avatar', () => {
    const chainTokens = [token('AAPLon', '0xAAPL'), token('DAI', '0xDAI')]
    const isStock = (props: Record<string, unknown>) =>
      (
        modalOf(mountWrapper({ chainTokens, ...props })).props(
          'items',
        ) as TokenSelectorItem[]
      ).map(item => item.isStock)

    expect(isStock({})).toEqual([true, false])
    expect(isStock({ networkName: undefined })).toEqual([false, false])
  })

  it('toggles the direction on a repeat sort pick and tracks every pick', async () => {
    const wrapper = mountWrapper()
    const modal = modalOf(wrapper)
    expect(modal.props('sortValue')).toBe('Rank')
    expect(modal.props('sortDirection')).toBe('asc')

    modal.vm.$emit('sort', 'Name')
    await wrapper.vm.$nextTick()
    expect(modal.props('sortValue')).toBe('Name')
    expect(modal.props('sortDirection')).toBe('asc')

    modal.vm.$emit('sort', 'Name')
    await wrapper.vm.$nextTick()
    expect(modal.props('sortDirection')).toBe('desc')

    modal.vm.$emit('sort', 'Price')
    await wrapper.vm.$nextTick()
    expect(modal.props('sortValue')).toBe('Price')
    expect(modal.props('sortDirection')).toBe('desc')
    expect(
      (modal.props('items') as TokenSelectorItem[]).map(item => item.id)[0],
    ).toBe('0xWBTC')

    expect(analytics.trackSwapClickSortEvent).toHaveBeenCalledTimes(3)
    expect(analytics.trackSwapClickSortEvent).toHaveBeenLastCalledWith(
      'Swap_Click_Sort',
      { sortOption: 'Price', isFromView: false },
    )
  })

  it('emits the raw token on select and remembers it', async () => {
    const wrapper = mountWrapper()
    const modal = modalOf(wrapper)
    const usdc = (modal.props('items') as TokenSelectorItem[]).find(
      item => item.id === '0xUSDC',
    )!
    modal.vm.$emit('select', usdc)

    expect(wrapper.emitted('update:selectedToken')?.[0][0]).toMatchObject({
      address: '0xUSDC',
    })
    expect(wrapper.emitted('select:token')?.[0][0]).toBe(usdc.raw)
    expect(
      useRecentlyViewedTokensStore().recentlyViewedCrypto[0],
    ).toMatchObject({ id: 'usd-coin', symbol: 'USDC' })
  })

  it('forwards the network dropdown and its changes', () => {
    const networks = [{ value: 'ETHEREUM', name: 'Ethereum' }]
    const wrapper = mountWrapper({ networks, network: 'ETHEREUM' })
    const modal = modalOf(wrapper)
    expect(modal.props('networks')).toEqual(networks)
    expect(modal.props('network')).toBe('ETHEREUM')

    modal.vm.$emit('update:network', 'BASE')
    expect(wrapper.emitted('update:network')).toEqual([['BASE']])
  })
})
