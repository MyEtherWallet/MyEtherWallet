import { describe, it, expect, vi, afterEach } from 'vitest'
import { ref } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

const chain = (name: string, nameLong: string) => ({
  name,
  nameLong,
  type: 'EVM',
})
const CHAINS = [
  chain('ETHEREUM', 'Ethereum'),
  chain('BITCOIN', 'Bitcoin'),
  chain('BSC', 'BNB Smart Chain'),
  chain('ARBITRUM', 'Arbitrum'),
  chain('POLYGON', 'Polygon'),
  chain('BASE', 'Base'),
]
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({ chains: ref(CHAINS) }),
}))
// storeToRefs on a plain object would wrap the ref again; pass the mock through.
vi.mock('pinia', async orig => ({
  ...(await orig<typeof import('pinia')>()),
  storeToRefs: (store: unknown) => store,
}))

const { default: NetworkChips } =
  await import('@/modules/access/components/NetworkChips.vue')
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

let wrapper: VueWrapper | undefined
const mountChips = (selected = CHAINS[0]) => {
  wrapper = mount(NetworkChips, {
    props: { selected },
    attachTo: document.body,
    global: { plugins: [i18n], stubs: { AppAvatar: true, teleport: true } },
  })
  return wrapper
}
afterEach(() => wrapper?.unmount())

const chips = (w: VueWrapper) => w.findAll('[data-testid="network-chip"]')
const options = (w: VueWrapper) =>
  w.findAll('[data-testid="network-option"]').map(o => o.text())

describe('NetworkChips', () => {
  it('renders the four pinned chains with the selected one pressed', () => {
    const w = mountChips()
    expect(chips(w).map(c => c.text())).toEqual([
      'Ethereum',
      'Bitcoin',
      'BNB Smart Chain',
      'Arbitrum',
    ])
    expect(
      w.get('[data-testid="network-chip"][aria-pressed="true"]').text(),
    ).toBe('Ethereum')
  })

  it('emits select for a pinned chip', async () => {
    const w = mountChips()
    await chips(w)[1].trigger('click')
    expect(w.emitted('select')?.[0]).toEqual([CHAINS[1]])
  })

  it('lists only the other chains in the menu and filters by search', async () => {
    const w = mountChips()
    await w.get('[data-testid="network-more"]').trigger('click')
    expect(options(w)).toEqual(['Polygon', 'Base'])
    await w.get('[data-testid="network-menu"] input').setValue('pol')
    expect(options(w)).toEqual(['Polygon'])
    await w.get('[data-testid="network-option"]').trigger('click')
    expect(w.emitted('select')?.[0]).toEqual([CHAINS[4]])
  })

  it('shows the extra chain as a selected chip and keeps the "+" button', () => {
    const w = mountChips(CHAINS[4])
    expect(chips(w).map(c => c.text())).toEqual([
      'Ethereum',
      'Bitcoin',
      'BNB Smart Chain',
      'Arbitrum',
      'Polygon',
    ])
    expect(
      w.get('[data-testid="network-chip"][aria-pressed="true"]').text(),
    ).toBe('Polygon')
    expect(w.get('[data-testid="network-more"]').text()).toBe('')
  })

  it('keeps an added network after selecting a pinned one', async () => {
    const w = mountChips(CHAINS[4])
    await w.setProps({ selected: CHAINS[0] })
    expect(chips(w).map(c => c.text())).toContain('Polygon')
    expect(
      w.get('[data-testid="network-chip"][aria-pressed="true"]').text(),
    ).toBe('Ethereum')
    await chips(w)[4].trigger('click')
    expect(w.emitted('select')?.at(-1)).toEqual([CHAINS[4]])
  })
})
