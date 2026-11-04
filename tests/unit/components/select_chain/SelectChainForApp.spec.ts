import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

// Chains are loaded but nothing is stored as the selected chain, so onMounted
// leaves `selectedChain` null. The picker must still open the chain dialog.
vi.mock('@/stores/chainsStore', async () => {
  const { ref } = await vi.importActual<typeof import('vue')>('vue')
  const eth = { name: 'ETHEREUM', nameLong: 'Ethereum', icon: '' }
  return {
    useChainsStore: () => ({
      chains: ref([eth]),
      isLoaded: ref(true),
      selectedChain: ref(null),
    }),
  }
})
vi.mock('@/stores/globalStore', async () => {
  const { ref } = await vi.importActual<typeof import('vue')>('vue')
  return {
    useGlobalStore: () => ({
      selectedNetwork: ref(''),
      setSelectedNetwork: vi.fn(),
    }),
  }
})
// storeToRefs -> identity so the plain store mocks above pass through unchanged.
vi.mock('pinia', async () => {
  const actual = await vi.importActual<typeof import('pinia')>('pinia')
  return { ...actual, storeToRefs: (store: unknown) => store }
})
vi.mock('@/components/select_chain/SelectChainDialog.vue', () => ({
  default: {
    props: ['isOpen'],
    template: '<div data-testid="chain-dialog" :data-open="String(isOpen)" />',
  },
}))

import SelectChainForApp from '@/components/select_chain/SelectChainForApp.vue'

describe('SelectChainForApp', () => {
  it('keeps the network picker usable when no chain is selected yet', async () => {
    const wrapper = mount(SelectChainForApp, {
      global: { mocks: { $t: (k: string) => k } },
    })
    // Let onMounted (which drops the default pick) re-render the trigger.
    await flushPromises()
    const picker = wrapper.get('[data-testid="picker"]')
    expect((picker.element as HTMLButtonElement).disabled).toBe(false)

    await picker.trigger('click')
    expect(
      wrapper.get('[data-testid="chain-dialog"]').attributes('data-open'),
    ).toBe('true')
    expect(picker.attributes('aria-expanded')).toBe('true')
  })
})
