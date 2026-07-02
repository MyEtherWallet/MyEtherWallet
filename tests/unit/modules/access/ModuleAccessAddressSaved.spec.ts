import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

const connect = vi.fn()
const clearAddressSavedInfo = vi.fn()
const config = { id: 'metamask', name: 'MetaMask' }
const addressSavedInfo = ref<Record<string, unknown> | null>({
  address: '0x32Be00000000000000000000000000000000D88a',
  addressName: 'Address1',
  walletName: 'MetaMask',
  walletIcon: '',
  config,
})

const accessStore = { addressSavedInfo, clearAddressSavedInfo }

vi.mock('@/stores/accessStore', () => ({ useAccessStore: () => accessStore }))
vi.mock('@/modules/access/composables/useConnectWallet', () => ({
  useConnectWallet: () => ({ connect }),
}))
// storeToRefs passthrough so the plain-object store works in the template
vi.mock('pinia', async importOriginal => {
  const actual = await importOriginal<typeof import('pinia')>()
  return {
    ...actual,
    storeToRefs: (store: Record<string, unknown>) => store,
  }
})

import ModuleAccessAddressSaved from '@/modules/access/ModuleAccessAddressSaved.vue'

const stubs = {
  AppDialog: {
    name: 'AppDialog',
    template: '<div><slot name="title" /><slot name="content" /></div>',
  },
}
const factory = () =>
  mount(ModuleAccessAddressSaved, {
    global: { stubs, mocks: { $t: (k: string, p?: Record<string, unknown>) => (p ? `${k}:${JSON.stringify(p)}` : k) } },
  })

describe('ModuleAccessAddressSaved', () => {
  it('shows the saved address name + truncated address', () => {
    const w = factory()
    expect(w.text()).toContain('Address1')
    expect(w.text()).toContain('0x32Be') // truncated address prefix
  })

  it('back clears the saved-address info (returns to chooser)', async () => {
    const w = factory()
    await w.get('[data-test="address-saved-back"]').trigger('click')
    expect(clearAddressSavedInfo).toHaveBeenCalled()
  })

  it('try again clears the info and re-attempts the connect', async () => {
    clearAddressSavedInfo.mockClear()
    connect.mockClear()
    const w = factory()
    await w.get('[data-test="address-saved-retry"]').trigger('click')
    expect(clearAddressSavedInfo).toHaveBeenCalled()
    expect(connect).toHaveBeenCalledWith(config)
  })

  it('open-wallet is informational (no connect, no clear)', async () => {
    clearAddressSavedInfo.mockClear()
    connect.mockClear()
    const w = factory()
    await w.get('[data-test="address-saved-open"]').trigger('click')
    expect(connect).not.toHaveBeenCalled()
    expect(clearAddressSavedInfo).not.toHaveBeenCalled()
  })
})
