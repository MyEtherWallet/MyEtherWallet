// tests/unit/composables/useAddAccount.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'

const openAccessDialog = vi.fn()
const addAccount = vi.fn(() => ({ added: true }))
const captureActiveAccount = vi.fn(() => ({ id: 'EVM:0xnew', address: '0xNew' }))
const addToastMessage = vi.fn()
const walletAddress = ref<string | null>('0xOld')

vi.mock('@/stores/accessStore', () => ({ useAccessStore: () => ({ openAccessDialog }) }))
vi.mock('@/stores/walletStore', () => ({ useWalletStore: () => ({ get walletAddress() { return walletAddress.value } }) }))
vi.mock('@/stores/savedAccountsStore', () => ({ useSavedAccountsStore: () => ({ captureActiveAccount, addAccount }) }))
vi.mock('@/stores/toastStore', () => ({ useToastStore: () => ({ addToastMessage }) }))

import { useAddAccount } from '@/composables/useAddAccount'

describe('useAddAccount', () => {
  beforeEach(() => { vi.clearAllMocks(); walletAddress.value = '0xOld' })

  it('opens the connect flow and captures the account when the active address changes', async () => {
    const { startAdd } = useAddAccount()
    startAdd()
    expect(openAccessDialog).toHaveBeenCalled()
    walletAddress.value = '0xNew' // connect succeeded
    await nextTick()
    expect(captureActiveAccount).toHaveBeenCalled()
    expect(addAccount).toHaveBeenCalledWith({ id: 'EVM:0xnew', address: '0xNew' })
  })

  it('shows a toast when the cap blocks the add', async () => {
    addAccount.mockReturnValueOnce({ added: false, reason: 'cap' })
    const { startAdd } = useAddAccount()
    startAdd()
    walletAddress.value = '0xNew'
    await nextTick()
    expect(addToastMessage).toHaveBeenCalled()
  })
})
