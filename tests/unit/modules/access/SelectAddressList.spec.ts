import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import SelectAddressList from '@/modules/access/components/SelectAddressList.vue'

vi.mock('@/stores/chainsStore', async () => {
  const { defineStore } = await import('pinia')
  const { ref } = await import('vue')
  return {
    useChainsStore: defineStore('chains', () => ({
      selectedChain: ref({
        currencyName: 'ETH',
        blockExplorerAddr: 'https://explorer/[[address]]',
      }),
    })),
  }
})

const walletList = [0, 1, 2, 3, 4].map(index => ({
  index,
  address: `0x${String(index).repeat(40)}`,
  balance: '0',
}))

const mountList = (modelValue = 1) =>
  mount(SelectAddressList, {
    props: { walletList, isLoading: false, modelValue },
    global: {
      stubs: { AppBtnCopy: true, AppBlockie: true },
      directives: { ripple: {} },
      mocks: { $t: (k: string) => k },
    },
  })

describe('SelectAddressList', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('renders one radio per address in a single group, the selected one checked', () => {
    const radios = mountList(1).findAll('input[type="radio"]')
    expect(radios).toHaveLength(5)
    expect(new Set(radios.map(r => r.attributes('name'))).size).toBe(1)
    expect(radios.map(r => (r.element as HTMLInputElement).checked)).toEqual([
      false,
      true,
      false,
      false,
      false,
    ])
  })

  it('selects an address from its radio', async () => {
    const wrapper = mountList(1)
    await wrapper.findAll('input[type="radio"]')[3].trigger('change')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([3])
  })

  it('still selects an address by clicking anywhere on its row', async () => {
    const wrapper = mountList(1)
    await wrapper.findAll('[data-testid="address-row"]')[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([2])
  })
})
