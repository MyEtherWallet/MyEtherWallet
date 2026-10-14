import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppTransactionInputCard from '@/components/AppTransactionInputCard.vue'

const mountCard = (props: Record<string, unknown> = {}, slots = {}) =>
  mount(AppTransactionInputCard, {
    props: { modelValue: '', inputLabel: 'Amount', ...props },
    slots,
    global: { stubs: { AppSpinner: true } },
  })

describe('AppTransactionInputCard', () => {
  it('renders the optional title, picker slot and balance', () => {
    const wrapper = mountCard(
      { title: 'You are selling', balance: 'Balance: 1 ETH' },
      { picker: '<button data-testid="picker-slot">ETH</button>' },
    )
    expect(wrapper.text()).toContain('You are selling')
    expect(wrapper.find('[data-testid="picker-slot"]').exists()).toBe(true)
    expect(
      wrapper.get('[data-testid="transaction-input-card-balance"]').text(),
    ).toBe('Balance: 1 ETH')
  })

  it('omits the title, balance and chip row when not provided', () => {
    const wrapper = mountCard()
    expect(wrapper.find('p').exists()).toBe(false)
    expect(wrapper.find('[data-testid="chip"]').exists()).toBe(false)
  })

  it('colours the balance as an error when asked', () => {
    const balance = mountCard({
      balance: 'Balance: 1 ETH',
      balanceError: true,
    }).get('[data-testid="transaction-input-card-balance"]')
    expect(balance.classes()).toContain('text-text-error')
  })

  it('emits the key of the clicked quick action', async () => {
    const wrapper = mountCard({
      quickActions: [
        { key: 25, label: '25%' },
        { key: 100, label: '100%' },
      ],
    })
    const chips = wrapper.findAll('[data-testid="chip"]')
    expect(chips).toHaveLength(2)
    await chips[1].trigger('click')
    expect(wrapper.emitted('quick-action')).toEqual([[100]])
  })

  it('disables a single quick action or all of them', () => {
    const one = mountCard({
      quickActions: [
        { key: 25, label: '25%', disabled: true },
        { key: 50, label: '50%' },
      ],
    }).findAll('[data-testid="chip"]')
    expect(one[0].attributes('disabled')).toBeDefined()
    expect(one[1].attributes('disabled')).toBeUndefined()

    const all = mountCard({
      disabled: true,
      quickActions: [{ key: 25, label: '25%' }],
    }).get('[data-testid="chip"]')
    expect(all.attributes('disabled')).toBeDefined()
  })

  it('keeps a long balance from squeezing the value: two independent rows', () => {
    const wrapper = mountCard(
      {
        modelValue: '0.0084513733',
        conversion: 'Minimum not reached',
        error: true,
        balance: 'Balance: 0.0112 AAPLON',
      },
      { picker: '<button data-testid="picker-slot">AAPLon</button>' },
    )
    const info = wrapper.get('[data-testid="transaction-input-card-info"]')
    const balance = wrapper.get(
      '[data-testid="transaction-input-card-balance"]',
    )
    // Info and balance share a row; the picker sits in the value row above
    expect(info.element.parentElement).toBe(balance.element.parentElement)
    expect(
      wrapper
        .get('[data-testid="picker-slot"]')
        .element.closest('.flex')
        ?.contains(info.element),
    ).toBe(false)
    expect(info.text()).toBe('Minimum not reached')
    expect(info.classes()).toContain('text-text-error')
    expect(balance.classes()).toContain('truncate')
    expect(
      wrapper
        .get('[data-testid="input-naked-input"]')
        .attributes('aria-describedby'),
    ).toBe(info.attributes('id'))
  })

  it('shows the hint while empty and a spinner while loading', () => {
    expect(
      mountCard({ infoMessage: 'Enter amount' })
        .get('[data-testid="transaction-input-card-info"]')
        .text(),
    ).toBe('Enter amount')
    expect(
      mountCard({ loading: true })
        .get('[data-testid="transaction-input-card-info"]')
        .find('app-spinner-stub')
        .exists(),
    ).toBe(true)
  })

  it('updates the model and forwards focus / blur from the input', async () => {
    const wrapper = mountCard()
    const input = wrapper.get('[data-testid="input-naked-input"]')
    await input.setValue('12.5')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['12.5'])
    await input.trigger('focus')
    await input.trigger('blur')
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toHaveLength(1)
  })
})
