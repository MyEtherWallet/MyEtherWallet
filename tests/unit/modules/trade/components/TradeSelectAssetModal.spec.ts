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

const AAPL = asset('AAPLON', '0x0000000000000000000000000000000000000001')
const ABNB = asset('ABNBON', '0x0000000000000000000000000000000000000002')
const ABT = asset('ABTON', '0x0000000000000000000000000000000000000003', {
  pauseReason: 'maintenance',
})
const ACN = asset('ACNON', '0x0000000000000000000000000000000000000004')

const STOCK_ADDRESSES = new Set(
  [AAPL, ABNB, ABT, ACN].map(({ address }) => address),
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

beforeEach(() => {
  document.body.innerHTML = '<div id="app"></div>'
})

afterEach(() => {
  mounted.splice(0).forEach(w => w.unmount())
})

describe('TradeSelectAssetModal (buy)', () => {
  it('keeps the list flat when nothing is paused or out of session', async () => {
    await mountOpenModal()

    expect(tickersIn('token-selector-all')).toEqual([
      'AAPLon',
      'ABNBon',
      'ACNon',
    ])
    expect(
      document.querySelector('[data-testid="token-selector-disabled"]'),
    ).toBeNull()
    expect(document.body.textContent).not.toContain('Unavailable assets')
  })

  it('groups session-unavailable and paused assets last under "Unavailable assets"', async () => {
    const wrapper = await mountOpenModal({
      chainTokens: [AAPL, ABNB, ABT, ACN],
      disabledTokens: [AAPL.address, ACN.address],
    })

    expect(tickersIn('token-selector-all')).toEqual(['ABNBon'])
    expect(tickersIn('token-selector-disabled')).toEqual([
      'AAPLon',
      'ABTon',
      'ACNon',
    ])
    const group = document.querySelector(
      '[data-testid="token-selector-disabled"]',
    )!
    expect(group.textContent).toContain('Unavailable assets')

    // Only the paused asset carries the pause tag, in place of its price.
    const [aapl, abt] = rowsIn('token-selector-disabled')
    expect(abt.textContent).toContain('In maintenance')
    expect(aapl.textContent).not.toContain('In maintenance')
    expect(
      rowItems(wrapper).find(i => i.symbol === 'ABTon')?.rightAccessory,
    ).toBeUndefined()

    abt.click()
    await nextTick()
    expect(wrapper.emitted('select:token')).toBeUndefined()
  })

  it('shows price and 24h change on the right', async () => {
    const wrapper = await mountOpenModal()

    expect(rowItems(wrapper)[0].rightAccessory).toEqual({
      kind: 'balance-performance',
      primary: expect.stringContaining('100'),
      change: 1,
    })
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

    const search = wrapper.findComponent({ name: 'AppTokenSelectorModal' })
    await search.vm.$emit('update:search', 'abnb')
    await nextTick()
    expect(tickersIn('token-selector-all')).toEqual(['ABNBon'])
  })

  it('selects the picked asset, marks it, and closes', async () => {
    const wrapper = await mountOpenModal()

    rowsIn('token-selector-all')[1].click()
    await flushPromises()

    expect(wrapper.emitted('select:token')?.[0]?.[0]).toMatchObject({
      symbol: 'ABNBON',
    })
    expect(wrapper.emitted('update:selectedToken')?.[0]?.[0]).toMatchObject({
      symbol: 'ABNBON',
    })
    expect(wrapper.emitted('open:selectToken')?.at(-1)).toEqual([false])

    await wrapper.setProps({ selectedToken: ABNB } as never)
    expect(
      wrapper.findComponent({ name: 'AppTokenSelectorModal' }).props(),
    ).toMatchObject({ selectedId: ABNB.address })
  })
})

describe('TradeSelectAssetModal (sell)', () => {
  it('shows the holding when there is one, the price otherwise, biggest first', async () => {
    const EMPTY = asset('ETH', '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
    const HELD = asset('USDC', '0x00000000000000000000000000000000000000aa', {
      balance: '2000000000000000000',
    })
    const wrapper = await mountOpenModal({
      side: 'sell',
      chainTokens: [EMPTY, HELD],
    })

    expect(tickersIn('token-selector-all')).toEqual(['USDC', 'ETH'])
    const [held, empty] = rowItems(wrapper)
    expect(held.rightAccessory).toMatchObject({
      kind: 'balance',
      secondary: '2 USDC',
    })
    expect(empty.rightAccessory).toMatchObject({ kind: 'balance-performance' })
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
