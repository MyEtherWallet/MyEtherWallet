import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import i18n from '@/i18n'
import AppSwapForm from '@/components/AppSwapForm.vue'

// The amount cards, chain selectors and network avatar read stores of their
// own (walletStore pulls in Ledger, which can't load here); the form only lays
// them out, so they are mocked with their slots kept.
vi.mock('@/components/AppSwapEnterAmount.vue', () => ({
  default: {
    name: 'AppSwapEnterAmount',
    props: { isFromView: { type: Boolean, default: true } },
    template:
      '<div data-testid="amount-card" :data-from="isFromView"><slot name="header" /><slot name="actions" /></div>',
  },
}))
vi.mock('@/components/select_chain/SelectChainForApp.vue', () => ({
  default: {
    name: 'SelectChainForApp',
    template:
      '<div data-testid="network"><slot name="network-button" /></div>',
  },
}))
vi.mock('@/components/avatar/AppAvatar.vue', () => ({
  default: { name: 'AppAvatar', template: '<i />' },
}))

const mountForm = (
  props: Record<string, unknown> = {},
  slots: Record<string, string> = {},
) =>
  mount(AppSwapForm, {
    props: {
      fromAmount: '',
      toAmount: '',
      fromError: '',
      toError: '',
      fromTokens: [],
      toTokens: [],
      ctaLabel: 'Review swap',
      ...props,
    },
    slots,
    global: {
      plugins: [i18n],
      directives: { ripple: {} },
    },
  })

const chips = '[data-testid="chip"]'
const cta = '[data-testid="swap-form-cta"]'

describe('AppSwapForm', () => {
  it('renders the from and to cards joined by the arrow', () => {
    const wrapper = mountForm()
    const cards = wrapper.findAll('[data-testid="amount-card"]')
    expect(cards).toHaveLength(2)
    expect(cards[0].attributes('data-from')).toBe('true')
    expect(cards[1].attributes('data-from')).toBe('false')
    expect(wrapper.find('[data-testid="swap-form-arrow"]').exists()).toBe(
      true,
    )
  })

  it('renders the quick actions as chips, 100 as MAX, and emits the percentage', async () => {
    const wrapper = mountForm({ quickActions: [25, 50, 75, 100] })
    const buttons = wrapper.findAll(chips)
    expect(buttons.map(b => b.text())).toEqual([
      '25%',
      '50%',
      '75%',
      'Max',
    ])
    await buttons[1].trigger('click')
    await buttons[3].trigger('click')
    expect(wrapper.emitted('percent')).toEqual([[50], [100]])
  })

  it('hides the quick actions when none are given', () => {
    expect(mountForm().findAll(chips)).toHaveLength(0)
  })

  it('shows the from network picker only when asked and always mounts the to one', () => {
    const swap = mountForm()
    const swapNetworks = swap.findAll('[data-testid="network"]')
    expect(swapNetworks).toHaveLength(1)
    expect(swapNetworks[0].classes()).toContain('hidden')

    const bridge = mountForm({ showFromNetwork: true, showToNetwork: true })
    const bridgeNetworks = bridge.findAll('[data-testid="network"]')
    expect(bridgeNetworks).toHaveLength(2)
    expect(bridgeNetworks[1].classes()).not.toContain('hidden')
  })

  it('renders the CTA from props and emits submit', async () => {
    const wrapper = mountForm({ ctaDisabled: false })
    expect(wrapper.get(cta).text()).toBe('Review swap')
    await wrapper.get(cta).trigger('click')
    expect(wrapper.emitted('submit')).toHaveLength(1)
  })

  it('lets the cta slot replace the default button', () => {
    const wrapper = mountForm({}, { cta: '<p data-testid="connect" />' })
    expect(wrapper.find(cta).exists()).toBe(false)
    expect(wrapper.find('[data-testid="connect"]').exists()).toBe(true)
  })

  it('renders the default slot between the cards and the CTA', () => {
    const wrapper = mountForm({}, { default: '<p data-testid="extra" />' })
    const html = wrapper.html()
    expect(html.indexOf('data-testid="extra"')).toBeGreaterThan(
      html.indexOf('swap-form-arrow'),
    )
    expect(html.indexOf('data-testid="extra"')).toBeLessThan(
      html.indexOf('swap-form-cta'),
    )
  })
})
