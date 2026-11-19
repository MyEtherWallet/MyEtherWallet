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
    const input = mountCard().find('input')
    expect(input.attributes('aria-label')).toBe('Sell')
    expect(input.attributes('readonly')).toBeUndefined()
  })

  it('hints "Enter amount" while the sell input is empty', () => {
    expect(mountCard().text()).toContain('Enter amount')
  })

  it('swaps the fiat value for a spinner while the quote loads', () => {
    expect(mountCard().find('svg.animate-spin').exists()).toBe(false)

    const card = mountCard({ fiatLoading: true })
    expect(card.find('svg.animate-spin').exists()).toBe(true)
    expect(card.text()).toContain('Balance')
  })

  it('renders a read-only, display-formatted amount on the buy side', () => {
    // The buy amount arrives raw (the quote's formatUnits output) and the card
    // formats it for display — grouping included.
    const card = mountCard({ side: 'buy', amount: '2.4574' })
    const input = card.find('input')
    expect(input.attributes('aria-label')).toBe('Buy')
    expect(input.attributes('readonly')).toBeDefined()
    expect(input.element.value).toContain('2.45')

    const grouped = mountCard({ side: 'buy', amount: '1234.5' })
    expect(grouped.find('input').element.value).toBe('1,234.5')
  })

  it('shows the percent row only on the sell side', () => {
    expect(mountCard().text()).toContain('MAX')
    expect(mountCard({ side: 'buy' }).text()).not.toContain('MAX')
  })

  it('emits the selected percentage', async () => {
    const card = mountCard()
    const buttons = card
      .findAll('button')
      .filter(button => ['25%', '50%', '75%', 'MAX'].includes(button.text()))
    expect(buttons).toHaveLength(4)

    await buttons[0].trigger('click')
    await buttons[3].trigger('click')
    expect(card.emitted('percent')).toEqual([[25], [100]])
  })

  it('disables MAX when maxDisabled is set', async () => {
    const card = mountCard({ maxDisabled: true })
    const maxButton = card
      .findAll('button')
      .filter(button => button.text() === 'MAX')[0]
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
        card.get('[data-testid="transaction-input-card-balance"]')

      const outOfBalance = mountCard({ balanceError: true })
      await outOfBalance.setProps({
        amount: '600',
        error: 'Not enough balance',
      })
      vi.advanceTimersByTime(1000)
      await nextTick()
      expect(balanceRow(outOfBalance).classes()).toContain('text-text-error')

      const belowMinimum = mountCard({ balanceError: false })
      await belowMinimum.setProps({ amount: '3', error: 'Enter +5 USDC' })
      vi.advanceTimersByTime(1000)
      await nextTick()
      expect(balanceRow(belowMinimum).classes()).toContain('text-text-subtle')
    } finally {
      vi.useRealTimers()
    }
  })

  it('turns the balance red together with the error, not before the quote finishes', async () => {
    vi.useFakeTimers()
    try {
      const card = mountCard({ balanceError: true, fiatLoading: true })
      await card.setProps({ amount: '7.5', error: 'Not enough balance' })
      vi.advanceTimersByTime(1000)
      await nextTick()

      const balanceRow = () =>
        card.get('[data-testid="transaction-input-card-balance"]')
      const info = () => card.get('[data-testid="transaction-input-card-info"]')
      expect(card.find('svg.animate-spin').exists()).toBe(true)
      expect(balanceRow().classes()).toContain('text-text-subtle')

      await card.setProps({ fiatLoading: false })
      expect(info().classes()).toContain('text-text-error')
      expect(balanceRow().classes()).toContain('text-text-error')
    } finally {
      vi.useRealTimers()
    }
  })

  it('keeps the spinner up until the error settles, instead of flashing the fiat value', async () => {
    vi.useFakeTimers()
    try {
      const card = mountCard({ fiatLoading: true })
      await card.setProps({ amount: '0.5', error: 'Enter +1 USDC' })
      vi.advanceTimersByTime(500)
      await card.setProps({ fiatLoading: false })

      expect(card.find('svg.animate-spin').exists()).toBe(true)
      expect(card.text()).not.toContain('$')

      vi.advanceTimersByTime(500)
      await nextTick()
      expect(card.find('svg.animate-spin').exists()).toBe(false)
      expect(card.text()).toContain('≈ $')
    } finally {
      vi.useRealTimers()
    }
  })

  it('shows the red conversion on error, and the message only when inline', async () => {
    vi.useFakeTimers()
    try {
      const info = (card: ReturnType<typeof mountCard>) =>
        card.get('[data-testid="transaction-input-card-info"]')

      const minimum = mountCard()
      await minimum.setProps({ amount: '0.5', error: 'Minimum not reached' })
      vi.advanceTimersByTime(1000)
      await nextTick()
      expect(info(minimum).text()).toMatch(/^≈ /)
      expect(info(minimum).classes()).toContain('text-text-error')
      expect(minimum.text()).not.toContain('Minimum not reached')

      const decimals = mountCard({ inlineError: true })
      await decimals.setProps({
        amount: '1.1234567',
        error: 'Remove 1 decimal',
      })
      vi.advanceTimersByTime(1000)
      await nextTick()
      expect(info(decimals).text()).toBe('Remove 1 decimal')
      expect(info(decimals).classes()).toContain('text-text-error')
    } finally {
      vi.useRealTimers()
    }
  })

  it('does not hold the spinner when the amount is cleared', async () => {
    vi.useFakeTimers()
    try {
      const card = mountCard({ amount: '5' })
      await card.setProps({ amount: '' })
      expect(card.find('svg.animate-spin').exists()).toBe(false)
    } finally {
      vi.useRealTimers()
    }
  })

  it('reports its spinner and visible error so the CTA can follow them', async () => {
    vi.useFakeTimers()
    try {
      const card = mountCard()
      await card.setProps({ amount: '0.5', error: 'Minimum not reached' })
      expect(card.emitted('update:busy')!.at(-1)).toEqual([true])

      vi.advanceTimersByTime(1000)
      await nextTick()
      expect(card.emitted('update:busy')!.at(-1)).toEqual([false])
      expect(card.emitted('update:errorVisible')!.at(-1)).toEqual([true])
    } finally {
      vi.useRealTimers()
    }
  })

  it('hides the balance row when showBalance is false', () => {
    expect(mountCard({ showBalance: false }).text()).not.toContain('Balance')
  })
})
