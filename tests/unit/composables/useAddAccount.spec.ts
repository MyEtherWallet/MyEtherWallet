import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ToastType } from '@/types/notification'

const accessStore = { isOpenAccessDialog: false, openAccessDialog: vi.fn(() => { accessStore.isOpenAccessDialog = true }), setExpectNewAddress: vi.fn(), setIntendedAddress: vi.fn() }
const watchOnly = { isAtCap: false }
const toastStore = { addToastMessage: vi.fn() }

vi.mock('@/stores/accessStore', () => ({ useAccessStore: () => accessStore }))
vi.mock('@/stores/watchOnlyStore', () => ({ useWatchOnlyStore: () => watchOnly }))
vi.mock('@/stores/toastStore', () => ({ useToastStore: () => toastStore }))
vi.mock('@/modules/access/common/walletConfigs', () => ({ walletConfigs: {} }))
vi.mock('@/modules/access/composables/useConnectWallet', () => ({ useConnectWallet: () => ({ connect: vi.fn() }) }))
vi.mock('@/composables/useWalletList', () => ({ useWalletList: () => ({ newWalletList: { value: [] } }) }))

import { useAddAccount } from '@/composables/useAddAccount'

beforeEach(() => {
  vi.clearAllMocks()
  accessStore.isOpenAccessDialog = false
  watchOnly.isAtCap = false
})

describe('useAddAccount', () => {
  it('opens the access dialog on startAdd', () => {
    useAddAccount().startAdd()
    expect(accessStore.openAccessDialog).toHaveBeenCalledTimes(1)
  })

  it('shows a cap toast and does not open the dialog when the store is full', () => {
    watchOnly.isAtCap = true
    useAddAccount().startAdd()
    expect(toastStore.addToastMessage).toHaveBeenCalledWith(
      expect.objectContaining({ text: 'Address limit reached', type: ToastType.Error }),
    )
    expect(accessStore.openAccessDialog).not.toHaveBeenCalled()
  })
})
