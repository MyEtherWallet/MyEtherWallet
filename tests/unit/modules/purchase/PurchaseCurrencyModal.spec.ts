import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// The avatar's chains store pulls the wallet configs, which load Ledger.
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))
import { nextTick } from 'vue'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import i18n from '@/i18n'
import AppCell from '@/components/cell/AppCell.vue'
import PurchaseCurrencyModal from '@/modules/purchase/components/PurchaseCurrencyModal.vue'

const mounted: VueWrapper[] = []

const mountModal = async (props: Record<string, unknown> = {}) => {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = mount(PurchaseCurrencyModal, {
    props: {
      isOpen: true,
      'onUpdate:isOpen': (v: boolean) => wrapper.setProps({ isOpen: v }),
      currencies: ['USD', 'EUR', 'GBP'],
      selected: 'EUR',
      ...props,
    } as never,
    global: { plugins: [pinia, i18n] },
    attachTo: '#app',
  })
  mounted.push(wrapper)
  await flushPromises()
  return wrapper
}

const rows = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>('[data-testid="currency-row"]'),
  )

beforeEach(() => {
  document.body.innerHTML = '<div id="app"></div>'
})

afterEach(() => {
  mounted.splice(0).forEach(w => w.unmount())
})

describe('PurchaseCurrencyModal', () => {
  it('titles the modal and lists currencies A–Z with their names', async () => {
    await mountModal()
    expect(document.querySelector('[role="dialog"]')?.textContent).toContain(
      'Select currency',
    )
    expect(rows().map(row => row.textContent)).toEqual([
      expect.stringContaining('EUREuro'),
      expect.stringContaining('GBP'),
      expect.stringContaining('USD'),
    ])
  })

  it('marks the selected currency', async () => {
    const wrapper = await mountModal()
    const cells = wrapper
      .findAllComponents(AppCell)
      .filter(cell => cell.attributes('data-testid') === 'currency-row')
    expect(cells.map(cell => cell.props('selected'))).toEqual([
      true,
      false,
      false,
    ])
  })

  it('filters by code or name', async () => {
    await mountModal()
    const input = document.querySelector<HTMLInputElement>(
      '[role="dialog"] input',
    )!
    input.value = 'pound'
    input.dispatchEvent(new Event('input'))
    await nextTick()
    expect(rows().map(row => row.textContent)).toEqual([
      expect.stringContaining('GBP'),
    ])

    input.value = 'zzz'
    input.dispatchEvent(new Event('input'))
    await nextTick()
    expect(rows()).toHaveLength(0)
    expect(
      document.querySelector('[data-testid="currency-empty"]')?.textContent,
    ).toContain('No currencies match')
  })

  it('emits the picked currency and closes', async () => {
    const wrapper = await mountModal()
    rows()[1].click()
    await nextTick()
    expect(wrapper.emitted('update:selected')?.[0]).toEqual(['GBP'])
    expect(wrapper.emitted('update:isOpen')?.[0]).toEqual([false])
  })

  it('shows skeleton rows while loading', async () => {
    await mountModal({ isLoading: true })
    expect(rows()).toHaveLength(0)
    expect(document.querySelector('[aria-busy="true"]')).not.toBeNull()
  })
})
