// tests/unit/stores/savedAccountsStore.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSavedAccountsStore } from '@/stores/savedAccountsStore'
import { buildId, type SavedAccount, SAVED_ACCOUNTS_CAP } from '@/stores/saved_accounts/savedAccountsLogic'
import { WalletConfigType } from '@/modules/access/common/walletConfigs'
import { WalletType } from '@/providers/types'

// Drive the derived active getter from a mockable walletStore + chainsStore.
const walletState = { walletAddress: '0xAAA0000000000000000000000000000000000001' as string | null }
const chainState = { selectedChain: { name: 'ETHEREUM', type: 'EVM' } as { name: string; type: string } | undefined }
vi.mock('@/stores/walletStore', () => ({
  useWalletStore: () => walletState,
}))
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => chainState,
}))
vi.mock('@/stores/watchOnlyStore', () => ({
  useWatchOnlyStore: () => ({ watchOnlyAddresses: { EVM: [], BITCOIN: [] } }),
}))
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
    enkrypt: { id: 'enkrypt', name: 'Enkrypt', icon: 'enkrypt.webp', type: ['extension'] },
  },
}))

const acct = (over: Partial<SavedAccount> = {}): SavedAccount => ({
  id: over.id ?? buildId('EVM', over.address ?? '0x1'),
  address: over.address ?? '0x1',
  chainType: 'EVM',
  kind: 'watchOnly',
  walletConfigType: WalletConfigType.EXTENSION,
  providerType: WalletType.WAGMI,
  connectorId: 'enkrypt',
  walletName: 'Enkrypt',
  icon: 'enkrypt.webp',
  addedAt: Date.now(),
  ...over,
})

describe('savedAccountsStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    walletState.walletAddress = '0xAAA0000000000000000000000000000000000001'
    chainState.selectedChain = { name: 'ETHEREUM', type: 'EVM' }
  })

  it('addAccount adds and persists to localStorage', () => {
    const store = useSavedAccountsStore()
    const res = store.addAccount(acct({ address: '0x1', addedAt: 1 }))
    expect(res.added).toBe(true)
    expect(store.accounts).toHaveLength(1)
    expect(JSON.parse(localStorage.getItem('savedAccounts')!)).toHaveLength(1)
  })

  it('addAccount blocks new ids at the cap', () => {
    const store = useSavedAccountsStore()
    for (let i = 0; i < SAVED_ACCOUNTS_CAP; i++) store.addAccount(acct({ address: '0x' + i, addedAt: i }))
    const res = store.addAccount(acct({ address: '0xover' }))
    expect(res).toEqual({ added: false, reason: 'cap' })
    expect(store.accounts).toHaveLength(SAVED_ACCOUNTS_CAP)
  })

  it('activeAccount/savedAccounts partition by the active address', () => {
    const store = useSavedAccountsStore()
    store.addAccount(acct({ address: '0xAAA0000000000000000000000000000000000001', addedAt: 1 })) // active
    store.addAccount(acct({ address: '0xBBB0000000000000000000000000000000000002', addedAt: 2 }))
    expect(store.activeId).toBe(buildId('EVM', '0xAAA0000000000000000000000000000000000001'))
    expect(store.activeAccount?.address).toBe('0xAAA0000000000000000000000000000000000001')
    expect(store.savedAccounts.map(a => a.address)).toEqual(['0xBBB0000000000000000000000000000000000002'])
  })

  it('removeAccount removes by id', () => {
    const store = useSavedAccountsStore()
    store.addAccount(acct({ address: '0x1', addedAt: 1 }))
    store.removeAccount(buildId('EVM', '0x1'))
    expect(store.accounts).toHaveLength(0)
  })

  it('activeId is null when no wallet address is set', () => {
    walletState.walletAddress = null
    const store = useSavedAccountsStore()
    expect(store.activeId).toBeNull()
    expect(store.activeAccount).toBeNull()
  })
})
