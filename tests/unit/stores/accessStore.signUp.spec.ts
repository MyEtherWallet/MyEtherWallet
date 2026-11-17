import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('@/analytics', () => ({
  analytics: { trackConnectWalletEvent: vi.fn() },
}))
// The wallet configs reach the hardware-wallet SDK — unavailable under jsdom.
vi.mock('@/modules/access/common/walletConfigs', () => ({}))

import { useAccessStore } from '@/stores/accessStore'

describe('accessStore.openSignUpDialog', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('opens the connect modal on its Log in / Sign Up view', () => {
    const store = useAccessStore()

    store.openSignUpDialog()

    expect(store.isOpenAccessDialog).toBe(true)
    expect(store.currentView).toBe('sign_up')
  })

  it('starts from a clean dialog even after an earlier connect attempt', () => {
    const store = useAccessStore()
    store.setWeb3ConnectionError('rejected')

    store.openSignUpDialog()

    expect(store.web3ConnectionError).toBeNull()
  })
})
