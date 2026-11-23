import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'

// The real composables import walletStore, which loads Ledger.
vi.mock('@/modules/perps/composables/usePerpsAuth', () => ({
  usePerpsBalance: () => ({
    balance: ref({
      walletBalance: '100',
      unrealizedPnl: '-1234567.89',
      marginBalance: '1000000',
    }),
  }),
  usePerpsPortfolioSummary: () => ({ summary: ref(null) }),
}))

// AppModal teleports and locks the page; render its slots inline.
vi.mock('@/components/modal/AppModal.vue', () => ({
  default: {
    name: 'AppModal',
    props: ['modelValue', 'title'],
    template: '<div><slot /><slot name="footer" /></div>',
  },
}))

import { mount } from '@vue/test-utils'
import i18n from '@/i18n'
import PerpsBalanceDetailsDialog from '@/modules/perps/components/PerpsBalanceDetailsDialog.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'

describe('PerpsBalanceDetailsDialog', () => {
  it('caps and wraps the value column so the label keeps its space', () => {
    const wrapper = mount(PerpsBalanceDetailsDialog, {
      props: { visible: true },
      global: { plugins: [i18n] },
    })
    const values = wrapper
      .findAllComponents(AppContentGroup)
      .filter(g => g.props('align') === 'right')

    expect(values.length).toBeGreaterThan(0)
    for (const value of values) {
      expect(value.classes()).toContain('max-w-[60%]')
      expect(value.classes()).not.toContain('shrink-0')
      expect(value.props('wrapTitle')).toBe(true)
      expect(value.text()).toBe(value.props('title'))
    }
    expect(wrapper.text()).toContain('$100')
  })
})
