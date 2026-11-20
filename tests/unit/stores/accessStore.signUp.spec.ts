import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('@/analytics', () => ({
  analytics: { trackConnectWalletEvent: vi.fn() },
}))
// The wallet configs reach the hardware-wallet SDK — unavailable under jsdom.
vi.mock('@/modules/access/common/walletConfigs', () => ({}))

import { useAccessStore } from '@/stores/accessStore'

describe('accessStore.openAccessDialog', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('always opens the connect modal on its Log in / Sign Up view', () => {
    const store = useAccessStore()

    store.openAccessDialog()

    expect(store.isOpenAccessDialog).toBe(true)
    expect(store.currentView).toBe('sign_up')
  })

  it('opens on Log in / Sign Up again after the wallet chooser was the last screen', () => {
    const store = useAccessStore()
    store.openAccessDialog()
    store.setCurrentView('default')
    store.closeAccessDialog()

    store.openAccessDialog()

    expect(store.currentView).toBe('sign_up')
  })

  it('opens straight on a wallet step when asked to, whatever was set before', () => {
    const store = useAccessStore()
    store.setCurrentView('keystore')

    store.openAccessDialogOn('ledger')

    expect(store.isOpenAccessDialog).toBe(true)
    expect(store.currentView).toBe('ledger')
  })

  it('starts from a clean dialog even after an earlier connect attempt', () => {
    const store = useAccessStore()
    store.setWeb3ConnectionError('rejected')

    store.openAccessDialog()

    expect(store.web3ConnectionError).toBeNull()
  })
})
