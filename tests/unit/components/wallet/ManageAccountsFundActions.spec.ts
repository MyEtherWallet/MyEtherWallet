import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ManageAccountsFundActions from '@/components/core_layouts/wallet/ManageAccountsFundActions.vue'

const render = () =>
  mount(ManageAccountsFundActions, {
    global: { mocks: { $t: (key: string) => key } },
  })
const card = (w: ReturnType<typeof render>, title: string) =>
  w.findAll('[data-testid="card"]').find(el => el.text().includes(title))

describe('ManageAccountsFundActions', () => {
  it('offers the two ways to fund the wallet, each with what it means', () => {
    const w = render()

    expect(w.findAll('[data-testid="card"]')).toHaveLength(2)
    for (const key of [
      'multi_address.fund.buy_title',
      'multi_address.fund.buy_description',
      'multi_address.fund.deposit_title',
      'multi_address.fund.deposit_description',
    ]) {
      expect(w.text()).toContain(key)
    }
  })

  it('asks to buy when "Buy crypto" is pressed', async () => {
    const w = render()

    await card(w, 'multi_address.fund.buy_title')!
      .find('button')
      .trigger('click')

    expect(w.emitted('buy')).toHaveLength(1)
    expect(w.emitted('deposit')).toBeUndefined()
  })

  it('asks to deposit when "Deposit from wallet" is pressed', async () => {
    const w = render()

    await card(w, 'multi_address.fund.deposit_title')!
      .find('button')
      .trigger('click')

    expect(w.emitted('deposit')).toHaveLength(1)
    expect(w.emitted('buy')).toBeUndefined()
  })

  it('does not offer to receive from an exchange', () => {
    expect(render().text().toLowerCase()).not.toContain('exchange')
  })
})
