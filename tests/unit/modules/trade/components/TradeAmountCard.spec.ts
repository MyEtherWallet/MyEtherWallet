import { describe, it, expect, vi } from 'vitest'

vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))

vi.mock('@/components/AppSwapSelectedToken.vue', () => ({
  default: {
    name: 'AppSwapSelectedToken',
    template: '<div data-testid="token-select" />',
  },
}))

import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createPinia } from 'pinia'
import i18n from '@/i18n'
import TradeAmountCard from '@/modules/trade/components/TradeAmountCard.vue'

const mountCard = (props: Record<string, unknown> = {}) =>
  mount(TradeAmountCard, {
    props: {
      side: 'sell',
      amount: '',
      ...props,
    },
    global: { plugins: [createPinia(), i18n] },
  })

describe('TradeAmountCard', () => {
  it('renders an editable input on the sell side', () => {
    const card = mountCard()
    expect(card.text()).toContain('Sell')
    expect(card.find('input').exists()).toBe(true)
  })

  it('scopes the hover highlight to the amount value, not the whole card', () => {
    const card = mountCard()
    expect(card.classes()).toContain(
      'has-[.amount-value:hover]:border-grey-subtle',
    )
    expect(card.find('.amount-value input').exists()).toBe(true)
  })

  it('swaps the fiat value for a spinner while the quote loads', () => {
    expect(mountCard().find('svg.animate-spin').exists()).toBe(false)

    const card = mountCard({ fiatLoading: true })
    expect(card.find('svg.animate-spin').exists()).toBe(true)
    expect(card.text()).toContain('Balance')
  })

  it('renders a read-only amount on the buy side', () => {
    const card = mountCard({ side: 'buy', amount: '2.4574' })
    expect(card.text()).toContain('Buy')
    expect(card.find('input').exists()).toBe(false)
    expect(card.text()).toContain('2.4574')
  })

  it('shows the percent row only on the sell side', () => {
    expect(mountCard().text()).toContain('Max')
    expect(mountCard({ side: 'buy' }).text()).not.toContain('Max')
  })

  it('emits the selected percentage', async () => {
    const card = mountCard()
    const buttons = card
      .findAll('button')
      .filter(button => ['25%', '50%', '75%', 'Max'].includes(button.text()))
    expect(buttons).toHaveLength(4)

    await buttons[0].trigger('click')
    await buttons[3].trigger('click')
    expect(card.emitted('percent')).toEqual([[25], [100]])
  })

  it('disables MAX when maxDisabled is set', async () => {
    const card = mountCard({ maxDisabled: true })
    const maxButton = card
      .findAll('button')
      .filter(button => button.text() === 'Max')[0]
    expect(maxButton.attributes('disabled')).toBeDefined()

    await maxButton.trigger('click')
    expect(card.emitted('percent')).toBeUndefined()
  })

  it('sanitizes pasted input before updating the amount', async () => {
    const card = mountCard()
    await card.find('input').setValue('1.2.3abc')
    const updates = card.emitted('update:amount')!
    expect(updates[updates.length - 1]).toEqual(['1.23'])
  })

  it('paints the balance red only for the insufficient-balance error', async () => {
    vi.useFakeTimers()
    try {
      const balanceRow = (card: ReturnType<typeof mountCard>) =>
        card.findAll('p').find(row => row.text().startsWith('Balance'))!

      const outOfBalance = mountCard({ balanceError: true })
      await outOfBalance.setProps({ amount: '600', error: 'Not enough balance' })
      vi.advanceTimersByTime(1000)
      await nextTick()
      expect(balanceRow(outOfBalance).classes()).toContain('text-error')

      const belowMinimum = mountCard({ balanceError: false })
      await belowMinimum.setProps({ amount: '3', error: 'Enter +5 USDC' })
      vi.advanceTimersByTime(1000)
      await nextTick()
      expect(balanceRow(belowMinimum).classes()).toContain('text-info')
    } finally {
      vi.useRealTimers()
    }
  })

  it('hides the balance row when showBalance is false', () => {
    expect(mountCard({ showBalance: false }).text()).not.toContain('Balance')
  })
})
