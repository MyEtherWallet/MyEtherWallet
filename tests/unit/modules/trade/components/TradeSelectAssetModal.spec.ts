import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))

import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import i18n from '@/i18n'
import TradeSelectAssetModal from '@/modules/trade/components/TradeSelectAssetModal.vue'
import { useChainsStore } from '@/stores/chainsStore'
import { useWalletStore } from '@/stores/walletStore'
import { useStocksStore } from '@/stores/stocksStore'
import { useMarketStatusStore } from '@/stores/marketStatusStore'
import { useRecentlyViewedTokensStore } from '@/stores/recentlyViewedTokensStore'
import { analytics } from '@/analytics'
import type { TokenSelectorItem } from '@/components/token_selector/types'

const asset = (symbol: string, address: string, extra = {}) => ({
  symbol,
  address,
  name: `${symbol} Inc.`,
  decimals: 18,
  price: 100,
  logoURI: '',
  priceChangePercentage24h: 1,
  ...extra,
})

const AAPL = asset('AAPLON', '0x0000000000000000000000000000000000000001', {
  marketCap: 3000,
})
const ABNB = asset('ABNBON', '0x0000000000000000000000000000000000000002', {
  marketCap: 1000,
  price: 300,
})
const ABT = asset('ABTON', '0x0000000000000000000000000000000000000003', {
  marketCap: 2500,
  pauseReason: 'maintenance',
})
const ACN = asset('ACNON', '0x0000000000000000000000000000000000000004', {
  marketCap: 2000,
  price: 200,
})
const NVDA = asset('NVDAON', '0x0000000000000000000000000000000000000005', {
  marketCap: 4000,
})
const ADBE = asset('ADBEON', '0x0000000000000000000000000000000000000006')
const META = asset('METAON', '0x0000000000000000000000000000000000000007')

const STOCK_ADDRESSES = new Set(
  [AAPL, ABNB, ABT, ACN, NVDA, ADBE, META].map(({ address }) => address),
)

const mounted: VueWrapper[] = []

const mountOpenModal = async (
  props: Record<string, unknown> = {},
  setup: () => void = () => {},
) => {
  const pinia = createPinia()
  setActivePinia(pinia)
  useChainsStore().isLoaded = true
  // The fixtures are listed stocks unless a test says otherwise.
  vi.spyOn(useStocksStore(), 'isStock').mockImplementation(address =>
    STOCK_ADDRESSES.has(address),
  )
  setup()

  const wrapper = mount(TradeSelectAssetModal, {
    props: {
      side: 'buy',
      networkName: 'ETHEREUM',
      chainTokens: [AAPL, ABNB, ACN],
      ...props,
    } as never,
    slots: {
      trigger: ({ open }: { open: () => void }) =>
        h('button', { 'data-testid': 'open', onClick: open }),
    },
    global: { plugins: [pinia, i18n] },
    attachTo: document.body,
  })
  mounted.push(wrapper)
  await wrapper.find('[data-testid="open"]').trigger('click')
  await flushPromises()
  return wrapper
}

const qa = (selector: string) =>
  Array.from(document.querySelectorAll<HTMLElement>(selector))
const rowsIn = (section: string) =>
  qa(`[data-testid="${section}"] [data-testid="token-selector-row"]`)
const tickersIn = (section: string) =>
  rowsIn(section).map(row =>
    row.querySelector('[data-testid="cg-title"]')?.textContent?.trim(),
  )
const rowItems = (wrapper: VueWrapper) =>
  wrapper
    .findAllComponents({ name: 'TokenSelectorList' })
    .flatMap(list => list.props('items') as TokenSelectorItem[])
const selector = (wrapper: VueWrapper) =>
  wrapper.findComponent({ name: 'AppTokenSelectorModal' })
const symbolsOf = (wrapper: VueWrapper, prop: string) =>
  (selector(wrapper).props(prop) as TokenSelectorItem[]).map(i => i.symbol)
const header = (section: string) =>
  document.querySelector(`[data-testid="${section}"]`)?.textContent ?? ''

const setSession = (marketStatus: string) => {
  useMarketStatusStore().marketStatus = {
    isOpen: true,
    marketStatus,
  } as never
}
const connectWallet = () => {
  const walletStore = useWalletStore()
  walletStore.wallet = {} as never
  walletStore.walletAddress = '0x00000000000000000000000000000000000000ff'
}

beforeEach(() => {
  document.body.innerHTML = '<div id="app"></div>'
  localStorage.clear()
  vi.spyOn(analytics, 'trackTradeClickSortEvent').mockResolvedValue()
})

afterEach(() => {
  mounted.splice(0).forEach(w => w.unmount())
})

describe('TradeSelectAssetModal (buy)', () => {
  it('lists every asset under "All tokens" by market cap when nothing is out of session', async () => {
    await mountOpenModal()

    expect(document.querySelector('[role="dialog"]')?.textContent).toContain(
      'Select asset to buy',
    )
    expect(tickersIn('token-selector-all')).toEqual([
      'AAPLon',
      'ACNon',
      'ABNBon',
    ])
    expect(header('token-selector-all')).toContain('All tokens')
    expect(header('token-selector-all')).toContain('by market cap')
    expect(
      document.querySelector('[data-testid="token-selector-unavailable"]'),
    ).toBeNull()
  })

  it('offers AAPL, NVDA, ADBE and META as quick picks, skipping unavailable ones', async () => {
    const wrapper = await mountOpenModal({
      chainTokens: [ABNB, META, AAPL, NVDA, ADBE],
      disabledTokens: [NVDA.address],
    })

    expect(symbolsOf(wrapper, 'quickPicks')).toEqual([
      'AAPLon',
      'ADBEon',
      'METAon',
    ])
  })

  it('lists the recently viewed stocks it can buy, newest first', async () => {
    const wrapper = await mountOpenModal(
      { chainTokens: [AAPL, ABNB, ABT, ACN] },
      () => {
        const recent = useRecentlyViewedTokensStore()
        for (const id of ['AAPLon', 'ABTon', 'TSLAon', 'ACNon'])
          recent.addToken({ id, symbol: id, name: id, isStock: true })
        recent.addToken({ id: 'aapl', symbol: 'AAPL', name: 'x' })
      },
    )

    // ABTon is paused, TSLAon isn't listed, the crypto entry isn't a stock.
    expect(symbolsOf(wrapper, 'recentItems')).toEqual(['ACNon', 'AAPLon'])
    expect(tickersIn('token-selector-recent')).toEqual(['ACNon', 'AAPLon'])
  })

  it('keeps a paused asset in place, dimmed, with its pause tag instead of the numbers', async () => {
    const wrapper = await mountOpenModal({
      chainTokens: [AAPL, ABNB, ABT, ACN],
    })

    expect(tickersIn('token-selector-all')).toEqual([
      'AAPLon',
      'ABTon',
      'ACNon',
      'ABNBon',
    ])
    const abt = rowsIn('token-selector-all')[1]
    expect(abt.getAttribute('aria-disabled')).toBe('true')
    expect(abt.textContent).toContain('In maintenance')
    expect(
      rowItems(wrapper).find(i => i.symbol === 'ABTon')?.rightAccessory,
    ).toBeUndefined()

    abt.click()
    await nextTick()
    expect(wrapper.emitted('select:token')).toBeUndefined()
  })

  it('names the session and groups its unavailable assets last', async () => {
    const wrapper = await mountOpenModal(
      { disabledTokens: [ACN.address, AAPL.address] },
      () => setSession('postmarket'),
    )

    expect(header('token-selector-all')).toContain('Available in post-market')
    expect(header('token-selector-all')).not.toContain('All tokens')
    expect(tickersIn('token-selector-all')).toEqual(['ABNBon'])
    expect(tickersIn('token-selector-unavailable')).toEqual(['AAPLon', 'ACNon'])
    expect(header('token-selector-unavailable')).toContain(
      'Unavailable during post-market',
    )
    // Out-of-session rows still show their price and 24h change.
    const items = selector(wrapper).props(
      'unavailableItems',
    ) as TokenSelectorItem[]
    expect(items[0].rightAccessory).toMatchObject({
      kind: 'balance-performance',
    })
  })

  it('falls back to "Unavailable assets" when the session is unknown', async () => {
    await mountOpenModal({ disabledTokens: [ACN.address] })

    expect(header('token-selector-all')).toContain('All tokens')
    expect(header('token-selector-unavailable')).toContain('Unavailable assets')
  })

  it('shows price and 24h change on the right', async () => {
    const wrapper = await mountOpenModal()

    expect(rowItems(wrapper)[0].rightAccessory).toEqual({
      kind: 'balance-performance',
      primary: expect.stringContaining('100'),
      change: 1,
    })
  })

  it('sorts by the picked option, flipping on a repeat pick, and tracks it', async () => {
    const wrapper = await mountOpenModal()
    const modal = selector(wrapper)

    modal.vm.$emit('sort', 'Price')
    await nextTick()
    expect(tickersIn('token-selector-all')).toEqual([
      'ABNBon',
      'ACNon',
      'AAPLon',
    ])
    modal.vm.$emit('sort', 'Price')
    await nextTick()
    expect(tickersIn('token-selector-all')).toEqual([
      'AAPLon',
      'ACNon',
      'ABNBon',
    ])
    expect(modal.props('sortDirection')).toBe('asc')

    modal.vm.$emit('sort', 'Name')
    await nextTick()
    expect(modal.props('sortDirection')).toBe('asc')
    expect(tickersIn('token-selector-all')).toEqual([
      'AAPLon',
      'ABNBon',
      'ACNon',
    ])
    expect(analytics.trackTradeClickSortEvent).toHaveBeenCalledTimes(3)
    expect(analytics.trackTradeClickSortEvent).toHaveBeenLastCalledWith(
      'Trade_Click_Sort',
      { sortOption: 'Name', isFromView: false },
    )
  })

  it('writes the ticker with its lowercase "on" suffix, no gradient', async () => {
    await mountOpenModal()

    expect(tickersIn('token-selector-all')[0]).toBe('AAPLon')
    expect(
      document.querySelector('[role="dialog"] span.bg-stock-gradient'),
    ).toBeNull()
  })

  it('draws every buy-side logo with the Stocks avatar', async () => {
    const wrapper = await mountOpenModal()

    const items = rowItems(wrapper)
    expect(items.length).toBeGreaterThan(0)
    items.forEach(item => expect(item.isStock).toBe(true))
  })

  it('fuzzy-filters on name and symbol', async () => {
    const wrapper = await mountOpenModal()

    await selector(wrapper).vm.$emit('update:search', 'abnb')
    await nextTick()
    expect(tickersIn('token-selector-all')).toEqual(['ABNBon'])
  })

  it('selects the picked asset, marks it, and closes', async () => {
    const wrapper = await mountOpenModal()

    rowsIn('token-selector-all')[2].click()
    await flushPromises()

    expect(wrapper.emitted('select:token')?.[0]?.[0]).toMatchObject({
      symbol: 'ABNBON',
    })
    expect(wrapper.emitted('update:selectedToken')?.[0]?.[0]).toMatchObject({
      symbol: 'ABNBON',
    })
    expect(wrapper.emitted('open:selectToken')?.at(-1)).toEqual([false])

    await wrapper.setProps({ selectedToken: ABNB } as never)
    expect(selector(wrapper).props()).toMatchObject({
      selectedId: ABNB.address,
    })
  })
})

describe('TradeSelectAssetModal (sell)', () => {
  const ETH = asset('ETH', '0x00000000000000000000000000000000000000bb', {
    marketCap: 5000,
  })
  const USDC = asset('USDC', '0x00000000000000000000000000000000000000aa', {
    balance: '2000000000000000000',
    marketCap: 100,
  })
  const HELD_AAPL = { ...AAPL, balance: '1000000000000000000' }

  it('lists the holdings under "Your assets", biggest first, then every asset', async () => {
    const wrapper = await mountOpenModal(
      { side: 'sell', chainTokens: [ETH, HELD_AAPL, USDC] },
      connectWallet,
    )

    expect(document.querySelector('[role="dialog"]')?.textContent).toContain(
      'Select asset to sell',
    )
    expect(tickersIn('token-selector-owned')).toEqual(['USDC', 'AAPLon'])
    const owned = selector(wrapper).props('ownedItems') as TokenSelectorItem[]
    expect(owned.map(i => i.rightAccessory)).toEqual([
      expect.objectContaining({ kind: 'balance', secondary: '2 USDC' }),
      expect.objectContaining({ kind: 'balance', secondary: '1 AAPLon' }),
    ])

    expect(tickersIn('token-selector-all')).toEqual(['ETH', 'AAPLon', 'USDC'])
    expect(header('token-selector-all')).toContain('All tokens')
    ;(selector(wrapper).props('items') as TokenSelectorItem[]).forEach(item =>
      expect(item.rightAccessory).toMatchObject({
        kind: 'balance-performance',
      }),
    )
    expect(selector(wrapper).props('quickPicks')).toEqual([])
    expect(selector(wrapper).props('recentItems')).toEqual([])
  })

  it('has no "Your assets" without a wallet', async () => {
    await mountOpenModal({ side: 'sell', chainTokens: [ETH, USDC] })

    expect(
      document.querySelector('[data-testid="token-selector-owned"]'),
    ).toBeNull()
    expect(tickersIn('token-selector-all')).toEqual(['ETH', 'USDC'])
  })

  it('tracks the sort as the "from" side', async () => {
    const wrapper = await mountOpenModal({
      side: 'sell',
      chainTokens: [ETH, USDC],
    })

    selector(wrapper).vm.$emit('sort', 'Market Cap')
    await nextTick()
    expect(tickersIn('token-selector-all')).toEqual(['USDC', 'ETH'])
    expect(analytics.trackTradeClickSortEvent).toHaveBeenCalledWith(
      'Trade_Click_Sort',
      { sortOption: 'Market Cap', isFromView: true },
    )
  })

  it('shows the stock alias instead of the wallet token name', async () => {
    const MELI = asset('MELION', '0x0000000000000000000000000000000000000009', {
      name: 'MercadoLibre (Ondo Tokenized Stock)',
    })
    await mountOpenModal({ side: 'sell', chainTokens: [MELI] }, () => {
      useWalletStore().tokens = [
        {
          contract: MELI.address,
          name: MELI.name,
          ondo: { stockAlias: 'MercadoLibre' },
        },
      ] as never
    })

    const dialogText = document.querySelector('[role="dialog"]')!.textContent!
    expect(dialogText).toContain('MercadoLibre')
    expect(dialogText).not.toContain('Ondo Tokenized Stock')
  })
})
