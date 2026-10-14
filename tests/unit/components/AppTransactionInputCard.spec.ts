import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppTransactionInputCard from '@/components/AppTransactionInputCard.vue'

const caption = '[data-testid="transaction-input-card-caption"]'
const actions = '[data-testid="transaction-input-card-actions"]'

describe('AppTransactionInputCard', () => {
  it('renders the input, picker, header and feedback slots', () => {
    const wrapper = mount(AppTransactionInputCard, {
      slots: {
        default: '<input data-testid="amount" />',
        picker: '<button data-testid="picker" />',
        header: '<p data-testid="header" />',
        feedback: '<p data-testid="feedback" />',
      },
    })
    for (const id of ['amount', 'picker', 'header', 'feedback']) {
      expect(wrapper.find(`[data-testid="${id}"]`).exists()).toBe(true)
    }
  })

  it('shows the caption only when given', () => {
    expect(mount(AppTransactionInputCard).find(caption).exists()).toBe(false)
    const wrapper = mount(AppTransactionInputCard, {
      props: { caption: 'Balance: 1 ETH' },
    })
    expect(wrapper.get(caption).text()).toBe('Balance: 1 ETH')
  })

  it('renders the quick-actions row only when the slot is filled', () => {
    expect(mount(AppTransactionInputCard).find(actions).exists()).toBe(false)
    const wrapper = mount(AppTransactionInputCard, {
      slots: { actions: '<button>MAX</button>' },
    })
    expect(wrapper.get(actions).text()).toBe('MAX')
  })
})
