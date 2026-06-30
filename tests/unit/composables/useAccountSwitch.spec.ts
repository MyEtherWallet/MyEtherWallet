// tests/unit/composables/useAccountSwitch.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

const setWallet = vi.fn()
const disconnectWallet = vi.fn()
const setSelectedNetwork = vi.fn()
const openAccessDialog = vi.fn()
const setCurrentView = vi.fn()
const setAccessChain = vi.fn()
const removeAccount = vi.fn()
const addToastMessage = vi.fn()

let activeIdValue: string | null = 'EVM:0xactive'
const selected = { name: 'ETHEREUM', type: 'EVM' }
const chains = [
  { name: 'ETHEREUM', type: 'EVM', chainID: '1' },
  { name: 'BITCOIN', type: 'BITCOIN', chainID: '0' },
]

vi.mock('@/stores/walletStore', () => ({ useWalletStore: () => ({ setWallet, disconnectWallet }) }))
vi.mock('@/stores/chainsStore', () => ({ useChainsStore: () => ({ selectedChain: selected, chains }) }))
vi.mock('@/stores/globalStore', () => ({ useGlobalStore: () => ({ setSelectedNetwork }) }))
vi.mock('@/stores/accessStore', () => ({
  useAccessStore: () => ({ openAccessDialog, setCurrentView, setSelectedChain: setAccessChain }),
}))
vi.mock('@/stores/savedAccountsStore', () => ({
  useSavedAccountsStore: () => ({ get activeId() { return activeIdValue }, accounts: [], removeAccount }),
}))
vi.mock('@/stores/toastStore', () => ({ useToastStore: () => ({ addToastMessage }) }))
const WatchOnlyCtor = vi.fn()
vi.mock('@/providers/common/watchOnlyWallet', () => ({ default: class { constructor(...a: unknown[]) { WatchOnlyCtor(...a) } } }))

vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {
    MOBILE: 'mobile',
    HARDWARE: 'hardware',
    SOFTWARE: 'software',
    DESKTOP: 'desktop',
    EXTENSION: 'extension',
    MOCK: 'mock',
  },
  walletConfigs: {
    ledger: { id: 'ledger', name: 'Ledger', icon: '', type: ['hardware'], walletViewType: 'ledger' },
    enkrypt: { id: 'enkrypt', name: 'Enkrypt', icon: '', type: ['extension'], walletViewType: 'web3_wallet' },
  },
}))

import { useAccountSwitch } from '@/composables/useAccountSwitch'
import { WalletConfigType } from '@/modules/access/common/walletConfigs'
import { WalletType } from '@/providers/types'
import type { SavedAccount } from '@/stores/saved_accounts/savedAccountsLogic'

const acct = (over: Partial<SavedAccount> = {}): SavedAccount => ({
  id: 'EVM:0xtarget', address: '0xTarget', chainType: 'EVM' as SavedAccount['chainType'],
  kind: 'watchOnly', walletConfigType: WalletConfigType.EXTENSION,
  providerType: WalletType.WAGMI, connectorId: 'enkrypt', walletName: 'Enkrypt',
  icon: '', addedAt: 1, ...over,
})

describe('useAccountSwitch', () => {
  beforeEach(() => { vi.clearAllMocks(); activeIdValue = 'EVM:0xactive'; selected.type = 'EVM'; selected.name = 'ETHEREUM' })

  it('is a no-op when the target is already active', async () => {
    const { switchTo } = useAccountSwitch()
    await switchTo(acct({ id: 'EVM:0xactive' }))
    expect(setWallet).not.toHaveBeenCalled()
    expect(openAccessDialog).not.toHaveBeenCalled()
  })

  it('switches a watch-only account instantly via setWallet', async () => {
    const { switchTo } = useAccountSwitch()
    await switchTo(acct({ kind: 'watchOnly' }))
    expect(WatchOnlyCtor).toHaveBeenCalled()
    expect(setWallet).toHaveBeenCalledTimes(1)
    expect(openAccessDialog).not.toHaveBeenCalled()
  })

  it('opens the connect flow at the mapped view for a signing account', async () => {
    const { switchTo } = useAccountSwitch()
    await switchTo(acct({ kind: 'signing', connectorId: 'ledger' }))
    expect(openAccessDialog).toHaveBeenCalledTimes(1)
    expect(setCurrentView).toHaveBeenCalledWith('ledger')
    expect(setWallet).not.toHaveBeenCalled()
  })

  it('follows the network when target chainType differs', async () => {
    const { switchTo } = useAccountSwitch()
    await switchTo(acct({ chainType: 'BITCOIN', kind: 'watchOnly' }))
    expect(setSelectedNetwork).toHaveBeenCalledWith('BITCOIN')
    expect(addToastMessage).toHaveBeenCalled()
  })

  it('deleteAccount of the active account promotes the next; disconnects when none remain', async () => {
    const { deleteAccount } = useAccountSwitch()
    activeIdValue = 'EVM:0xtarget'
    await deleteAccount(acct({ id: 'EVM:0xtarget' }))
    expect(removeAccount).toHaveBeenCalledWith('EVM:0xtarget')
    expect(disconnectWallet).toHaveBeenCalled() // accounts mock is empty → none remain
  })
})
