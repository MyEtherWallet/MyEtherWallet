import { describe, it, expect, vi, afterEach } from 'vitest'
import { ref } from 'vue'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
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
  it('renders the three pinned chains with the selected one pressed', () => {
    const w = mountChips()
    expect(chips(w).map(c => c.text())).toEqual([
      'Ethereum',
      'Bitcoin',
      'BNB Smart Chain',
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
    expect(options(w)).toEqual(['Arbitrum', 'Polygon', 'Base'])
    await w.get('[data-testid="network-menu"] input').setValue('pol')
    expect(options(w)).toEqual(['Polygon'])
    await w.get('[data-testid="network-option"]').trigger('click')
    expect(w.emitted('select')?.[0]).toEqual([CHAINS[4]])
  })

  it('turns the "+" into a pill with the picked network instead of adding a chip', () => {
    const w = mountChips(CHAINS[4])
    expect(chips(w)).toHaveLength(3)
    expect(
      w.find('[data-testid="network-chip"][aria-pressed="true"]').exists(),
    ).toBe(false)
    const more = w.get('[data-testid="network-more"]')
    expect(more.get('app-avatar-stub').attributes('chain')).toBe('POLYGON')
    expect(more.classes()).toContain('border-black')
  })

  it('keeps the picked network in the pill after selecting a pinned one', async () => {
    const w = mountChips(CHAINS[4])
    await w.setProps({ selected: CHAINS[0] })
    const more = w.get('[data-testid="network-more"]')
    expect(more.get('app-avatar-stub').attributes('chain')).toBe('POLYGON')
    expect(more.classes()).not.toContain('border-black')
    expect(
      w.get('[data-testid="network-chip"][aria-pressed="true"]').text(),
    ).toBe('Ethereum')
  })

  it('marks the selected network in the menu', async () => {
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView
    const w = mountChips(CHAINS[4])
    await w.get('[data-testid="network-more"]').trigger('click')
    await flushPromises()
    const [arbitrum, polygon] = w.findAll('[data-testid="network-option"]')
    expect(polygon.classes()).toContain('bg-background-default')
    expect(polygon.find('svg').exists()).toBe(true)
    expect(arbitrum.classes()).not.toContain('bg-background-default')
    expect(arbitrum.find('svg').exists()).toBe(false)
    expect(scrollIntoView.mock.contexts[0]).toBe(polygon.element)
  })
})
