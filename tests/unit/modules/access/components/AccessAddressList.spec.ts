import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

// The avatar types reach the wallet stores (and Ledger), which don't load here.
vi.mock('@/components/avatar/AppAvatar.vue', () => ({
  default: { template: '<span data-testid="avatar" />' },
}))
const { default: AccessAddressList } =
  await import('@/modules/access/components/AccessAddressList.vue')

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

const ENTRIES = [
  {
    address: '0x1111111111111111111111111111111111111111',
    index: 0,
    balance: '',
  },
  {
    address: '0x2222222222222222222222222222222222222222',
    index: 1,
    balance: '',
  },
]

describe('AccessAddressList', () => {
  it('numbers each address from 1, right before its identicon', () => {
    const w = mount(AccessAddressList, {
      props: {
        entries: ENTRIES,
        isLoading: false,
        balancesError: false,
        modelValue: 0,
      },
      global: { plugins: [i18n] },
    })
    const rows = w.findAll('[data-testid="address-row"]')
    expect(
      rows.map(row => row.get('[data-testid="address-index"]').text()),
    ).toEqual(['1', '2'])
    const index = rows[0].get('[data-testid="address-index"]').element
    const avatar = rows[0].get('[data-testid="avatar"]').element
    expect(index.nextElementSibling).toBe(avatar)
  })
})
