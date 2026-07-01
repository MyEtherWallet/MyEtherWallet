import { describe, it, expect, beforeEach, vi } from 'vitest'

const accessStore = { isOpenAccessDialog: false, openAccessDialog: vi.fn(() => { accessStore.isOpenAccessDialog = true }) }
const watchOnly = { isAtCap: false }
const toastStore = { addToastMessage: vi.fn() }

vi.mock('@/stores/accessStore', () => ({ useAccessStore: () => accessStore }))
vi.mock('@/stores/watchOnlyStore', () => ({ useWatchOnlyStore: () => watchOnly }))
vi.mock('@/stores/toastStore', () => ({ useToastStore: () => toastStore }))

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
      expect.objectContaining({ type: expect.anything() }),
    )
    expect(accessStore.openAccessDialog).not.toHaveBeenCalled()
  })
})
