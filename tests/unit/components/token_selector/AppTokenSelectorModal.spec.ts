import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// chainsStore (network avatars) pulls the wallet configs, which load Ledger.
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))
import { nextTick } from 'vue'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import i18n from '@/i18n'
import AppTokenSelectorModal from '@/components/token_selector/AppTokenSelectorModal.vue'
import AppCell from '@/components/cell/AppCell.vue'
import type { TokenSelectorItem } from '@/components/token_selector/types'

const token = (
  symbol: string,
  extra: Partial<TokenSelectorItem> = {},
): TokenSelectorItem => ({
  id: symbol.toLowerCase(),
  symbol,
  name: `${symbol} name`,
  rightAccessory: { kind: 'balance', primary: '$1.00' },
  raw: { symbol },
  ...extra,
})

const USDC = token('USDC')
const ETH = token('ETH')
const WBTC = token('WBTC')
const PAUSED = token('PAUSED', { disabled: true })

const mounted: VueWrapper[] = []

const mountModal = async (props: Record<string, unknown> = {}) => {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = mount(AppTokenSelectorModal, {
    props: {
      modelValue: true,
      'onUpdate:modelValue': (v: boolean) =>
        wrapper.setProps({ modelValue: v }),
      title: 'Select asset to buy',
      items: [USDC, ETH, WBTC],
      ...props,
    } as never,
    global: { plugins: [pinia, i18n] },
    attachTo: '#app',
  })
  mounted.push(wrapper)
  await flushPromises()
  return wrapper
}

const q = (selector: string) => document.querySelector<HTMLElement>(selector)
const qa = (selector: string) =>
  Array.from(document.querySelectorAll<HTMLElement>(selector))
const rowsIn = (section: string) =>
  qa(`[data-testid="${section}"] [data-testid="token-selector-row"]`)

beforeEach(() => {
  document.body.innerHTML = '<div id="app"></div>'
})

afterEach(() => {
  mounted.splice(0).forEach(w => w.unmount())
})

describe('AppTokenSelectorModal', () => {
  it('renders the quick picks, recently viewed and every token row', async () => {
    await mountModal({ quickPicks: [USDC, ETH], recentItems: [WBTC] })

    expect(q('[role="dialog"]')?.textContent).toContain('Select asset to buy')
    const cards = qa(
      '[data-testid="token-selector-quick-picks"] [data-testid="card"]',
    )
    // The avatars fall back to initials, so match the symbol label.
    expect(cards.map(card => card.textContent?.trim())).toEqual([
      expect.stringMatching(/USDC$/),
      expect.stringMatching(/ETH$/),
    ])
    expect(rowsIn('token-selector-recent')).toHaveLength(1)
    expect(q('[data-testid="token-selector-recent"]')?.textContent).toContain(
      'Recently viewed',
    )
    const rows = rowsIn('token-selector-all')
    expect(rows).toHaveLength(3)
    expect(rows[0].textContent).toContain('USDC')
    expect(rows[0].textContent).toContain('USDC name')
    expect(rows[0].textContent).toContain('$1.00')
  })

  it('hides the pinned sections while searching', async () => {
    await mountModal({
      quickPicks: [USDC],
      recentItems: [WBTC],
      search: 'us',
      items: [USDC],
    })
    expect(q('[data-testid="token-selector-quick-picks"]')).toBeNull()
    expect(q('[data-testid="token-selector-recent"]')).toBeNull()
    expect(rowsIn('token-selector-all')).toHaveLength(1)
  })

  it('emits the picked item and closes, from a row or a card', async () => {
    const wrapper = await mountModal({ quickPicks: [ETH] })
    rowsIn('token-selector-all')[0].click()
    await nextTick()
    expect(wrapper.emitted('select')?.[0]).toEqual([USDC])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])

    await wrapper.setProps({ modelValue: true } as never)
    await flushPromises()
    q(
      '[data-testid="token-selector-quick-picks"] [data-testid="card-hit"]',
    )!.click()
    await nextTick()
    expect(wrapper.emitted('select')?.[1]).toEqual([ETH])
  })

  it('keeps disabled tokens in place and never picks them', async () => {
    const wrapper = await mountModal({ items: [PAUSED, USDC] })
    const rows = rowsIn('token-selector-all')
    expect(rows.map(row => row.getAttribute('aria-disabled'))).toEqual([
      'true',
      null,
    ])
    rows[0].click()
    await nextTick()
    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('draws the unavailable tokens last, dimmed, under their title', async () => {
    const wrapper = await mountModal({
      items: [USDC],
      unavailableItems: [ETH],
      unavailableTitle: 'Unavailable during post-market',
    })
    const group = q('[data-testid="token-selector-unavailable"]')!
    expect(group.textContent).toContain('Unavailable during post-market')
    expect(group.previousElementSibling?.getAttribute('data-testid')).toBe(
      'token-selector-all',
    )
    const [row] = rowsIn('token-selector-unavailable')
    expect(row.getAttribute('aria-disabled')).toBe('true')
    row.click()
    await nextTick()
    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('shows "Your assets" between "Recently viewed" and the main list', async () => {
    const wrapper = await mountModal({ recentItems: [WBTC], ownedItems: [ETH] })
    const owned = q('[data-testid="token-selector-owned"]')!
    expect(owned.textContent).toContain('Your assets')
    expect(owned.previousElementSibling?.getAttribute('data-testid')).toBe(
      'token-selector-recent',
    )
    expect(owned.nextElementSibling?.getAttribute('data-testid')).toBe(
      'token-selector-all',
    )
    rowsIn('token-selector-owned')[0].click()
    await nextTick()
    expect(wrapper.emitted('select')?.[0]).toEqual([ETH])

    await wrapper.setProps({ modelValue: true, search: 'us' } as never)
    expect(q('[data-testid="token-selector-owned"]')).toBeNull()
    await wrapper.setProps({ search: '', loading: true } as never)
    expect(q('[data-testid="token-selector-owned"]')).toBeNull()
  })

  it('titles the main list with listTitle, keeping the sort control', async () => {
    await mountModal({
      listTitle: 'Available in post-market',
      sortOptions: [{ value: 'market_cap', label: 'Market Cap' }],
    })
    const header = q('[data-testid="token-selector-all"]')!
    expect(header.textContent).toContain('Available in post-market')
    expect(header.textContent).toContain('by market cap')
    expect(header.textContent).not.toContain('All tokens')
  })

  it('draws tokenized stocks with the Stocks avatar', async () => {
    const wrapper = await mountModal({
      items: [token('AAPLON', { isStock: true }), USDC],
    })
    const avatars = wrapper.findAllComponents({ name: 'AppAvatar' })
    expect(avatars.map(a => a.props('type'))).toEqual(['stocks', 'cryptoAsset'])
  })

  it('marks the selected token', async () => {
    const wrapper = await mountModal({ selectedId: 'eth' })
    const rows = wrapper.findAllComponents(AppCell)
    expect(rows.map(row => row.props('selected'))).toEqual([false, true, false])
  })

  it('marks the selected quick pick, leaving the others unpressed', async () => {
    await mountModal({ quickPicks: [USDC, ETH], selectedId: 'eth' })
    const hits = qa(
      '[data-testid="token-selector-quick-picks"] [data-testid="card-hit"]',
    )
    expect(hits.map(hit => hit.getAttribute('aria-pressed'))).toEqual([
      null,
      'true',
    ])
  })

  it('tells an empty list from an empty search', async () => {
    const wrapper = await mountModal({ items: [] })
    expect(q('[data-testid="token-selector-empty"]')?.textContent).toContain(
      'No tokens available',
    )
    await wrapper.setProps({ search: 'zzz' } as never)
    expect(q('[data-testid="token-selector-empty"]')?.textContent).toContain(
      'No tokens match your search',
    )
  })

  it('shows skeleton rows while loading', async () => {
    await mountModal({ loading: true, quickPicks: [USDC] })
    expect(rowsIn('token-selector-all')).toHaveLength(0)
    expect(q('[data-testid="token-selector-quick-picks"]')).toBeNull()
    expect(q('[aria-busy="true"]')).not.toBeNull()
  })

  it('labels the sort control and emits every pick, a repeat one included', async () => {
    const wrapper = await mountModal({
      sortOptions: [
        { value: 'rank', label: 'Rank' },
        { value: 'market_cap', label: 'Market Cap' },
      ],
      sortValue: 'market_cap',
    })
    const sort = q(
      '[data-testid="token-selector-all"] [data-testid="dropdown-trigger"]',
    )!
    expect(sort.textContent?.trim()).toBe('by market cap')

    sort.click()
    await flushPromises()
    const options = qa('[data-testid="token-selector-all"] [role="option"]')
    expect(options.map(o => o.getAttribute('aria-selected'))).toEqual([
      'false',
      'true',
    ])
    options[1].click()
    await nextTick()
    expect(wrapper.emitted('sort')).toEqual([['market_cap']])
  })

  it('reads "All tokens" with no sort control when the flow has no sort', async () => {
    await mountModal()
    expect(
      q('[data-testid="token-selector-all"] [data-testid="dropdown"]'),
    ).toBeNull()
    expect(q('[data-testid="token-selector-all"]')?.textContent).toContain(
      'All tokens',
    )
  })

  it('shows the network dropdown only when networks are passed', async () => {
    const wrapper = await mountModal()
    expect(
      q('[data-testid="token-selector-toolbar"] [data-testid="dropdown"]'),
    ).toBeNull()

    await wrapper.setProps({
      networks: [
        { value: null, name: 'All networks' },
        { value: 'ETH', name: 'Ethereum' },
      ],
      network: 'ETH',
    } as never)
    const trigger = q(
      '[data-testid="token-selector-toolbar"] [data-testid="dropdown-trigger"]',
    )!
    expect(trigger.textContent).toContain('Ethereum')
    trigger.click()
    await flushPromises()
    qa('[data-testid="token-selector-toolbar"] [role="option"]')[0].click()
    await nextTick()
    expect(wrapper.emitted('update:network')?.[0]).toEqual([null])
  })

  it('offers load more when the caller has more pages', async () => {
    const wrapper = await mountModal({ hasMore: true })
    q('[data-testid="token-selector-load-more"]')!.click()
    expect(wrapper.emitted('load-more')).toHaveLength(1)
  })

  it('clears the search once closed', async () => {
    const wrapper = await mountModal({ search: 'eth' })
    await wrapper.setProps({ modelValue: false } as never)
    await flushPromises()
    wrapper.findComponent({ name: 'AppModal' }).vm.$emit('closed')
    await nextTick()
    expect(wrapper.emitted('update:search')?.at(-1)).toEqual([''])
  })
})
