import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

const connect = vi.fn()
const openExtensionAccounts = vi.fn(() => Promise.resolve())
const watchExtensionAccounts = vi.fn(() => () => {})
const clearConnectAddressInfo = vi.fn()
const config = { id: 'metamask', name: 'MetaMask' }
const connectAddressInfo = ref<Record<string, unknown> | null>({
  address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  walletName: 'MetaMask',
  walletIcon: '',
  config,
})

const accessStore = { connectAddressInfo, clearConnectAddressInfo }

vi.mock('@/stores/accessStore', () => ({ useAccessStore: () => accessStore }))
vi.mock('@/modules/access/composables/useConnectWallet', () => ({
  useConnectWallet: () => ({ connect, openExtensionAccounts, watchExtensionAccounts }),
}))
vi.mock('pinia', async importOriginal => {
  const actual = await importOriginal<typeof import('pinia')>()
  return { ...actual, storeToRefs: (s: Record<string, unknown>) => s }
})

import ModuleAccessConnectAddress from '@/modules/access/ModuleAccessConnectAddress.vue'

const stubs = {
  AppDialog: {
    name: 'AppDialog',
    template: '<div><slot name="title" /><slot name="content" /></div>',
  },
}
const factory = () =>
  mount(ModuleAccessConnectAddress, {
    global: {
      stubs,
      mocks: { $t: (k: string, p?: Record<string, unknown>) => (p ? `${k}:${JSON.stringify(p)}` : k) },
    },
  })

describe('ModuleAccessConnectAddress', () => {
  it('shows the full intended address to select in the extension', () => {
    expect(factory().text()).toContain('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')
  })

  it('back clears the info (returns to the chooser)', async () => {
    clearConnectAddressInfo.mockClear()
    await factory().get('[data-test="connect-address-back"]').trigger('click')
    expect(clearConnectAddressInfo).toHaveBeenCalled()
  })

  it('open-wallet opens the extension picker then re-attempts the connect', async () => {
    connect.mockClear()
    openExtensionAccounts.mockClear()
    const w = factory()
    await w.get('[data-test="connect-address-open"]').trigger('click')
    await Promise.resolve()
    expect(openExtensionAccounts).toHaveBeenCalledWith(config)
    expect(connect).toHaveBeenCalledWith(config)
  })

  it('registers an accountsChanged watcher while shown', () => {
    watchExtensionAccounts.mockClear()
    factory()
    expect(watchExtensionAccounts).toHaveBeenCalledWith(config, expect.any(Function))
  })
})
