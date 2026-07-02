import { describe, it, expect, beforeEach, vi } from 'vitest'

const walletStore = {
  activeId: 'EVM:0xactive',
  setWallet: vi.fn(),
  disconnectWallet: vi.fn(),
  walletAddress: '0xactive',
}
const watchOnly = {
  activeId: 'EVM:0xactive',
  removeWallet: vi.fn(),
  allAccounts: [] as any[],
  watchOnlyAddresses: { EVM: [], BITCOIN: [] } as any,
}
const chainsStore = {
  selectedChain: { type: 'EVM', name: 'ETH' },
  chains: [{ type: 'EVM', name: 'ETH' }, { type: 'BITCOIN', name: 'BTC' }],
}
const accessStore = { setSelectedChain: vi.fn(), openAccessDialog: vi.fn(), setCurrentView: vi.fn() }
const globalStore = { setSelectedNetwork: vi.fn() }
const toastStore = { addToastMessage: vi.fn() }

vi.mock('@/stores/walletStore', () => ({ useWalletStore: () => walletStore }))
vi.mock('@/stores/watchOnlyStore', () => ({ useWatchOnlyStore: () => watchOnly }))
vi.mock('@/stores/chainsStore', () => ({ useChainsStore: () => chainsStore }))
vi.mock('@/stores/accessStore', () => ({ useAccessStore: () => accessStore }))
vi.mock('@/stores/globalStore', () => ({ useGlobalStore: () => globalStore }))
vi.mock('@/stores/toastStore', () => ({ useToastStore: () => toastStore }))
vi.mock('@/modules/access/common/walletConfigs', () => ({ walletConfigs: {} }))
vi.mock('@/providers/common/watchOnlyWallet', () => ({
  default: class { constructor(public a: string) {} },
}))

import { useAccountSwitch } from '@/composables/useAccountSwitch'
import type { SavedAccount } from '@/stores/saved_accounts/savedAccountsLogic'

const acc = (over: Partial<SavedAccount> = {}): SavedAccount => ({
  id: over.id ?? 'EVM:0xnew',
  address: over.address ?? '0xnew',
  chainType: 'EVM',
  kind: over.kind ?? 'watchOnly',
  walletConfigType: 'software' as any,
  providerType: 'INJECTED' as any,
  walletName: 'W',
  addressName: 'Address 2',
  icon: '',
  ...over,
})

beforeEach(() => {
  vi.clearAllMocks()
  watchOnly.activeId = 'EVM:0xactive'
})

describe('useAccountSwitch', () => {
  it('no-ops when the account is already active', async () => {
    await useAccountSwitch().switchTo(acc({ id: 'EVM:0xactive', address: '0xactive' }))
    expect(walletStore.setWallet).not.toHaveBeenCalled()
  })

  it('watch-only target sets a WatchOnlyWallet (instant), no connect dialog', async () => {
    await useAccountSwitch().switchTo(acc({ kind: 'watchOnly' }))
    expect(walletStore.setWallet).toHaveBeenCalledTimes(1)
    expect(accessStore.openAccessDialog).not.toHaveBeenCalled()
  })

  it('signing target also switches read-only (view) and never opens the connect flow', async () => {
    await useAccountSwitch().switchTo(acc({ kind: 'signing' }))
    expect(walletStore.setWallet).toHaveBeenCalledTimes(1)
    expect(accessStore.openAccessDialog).not.toHaveBeenCalled()
  })

  it('deleteAccount removes and promotes the next entry as a read-only view when active', async () => {
    watchOnly.watchOnlyAddresses = {
      EVM: [{ address: '0xother', walletName: 'W', chain: { type: 'EVM', name: 'ETH' }, type: 'EVM', walletType: 'INJECTED', addressName: 'Address 3' }],
      BITCOIN: [],
    }
    await useAccountSwitch().deleteAccount(acc({ id: 'EVM:0xactive', address: '0xactive' }))
    expect(watchOnly.removeWallet).toHaveBeenCalledWith('0xactive', expect.objectContaining({ type: 'EVM' }))
    expect(walletStore.setWallet).toHaveBeenCalledTimes(1)
  })

  it('deleteAccount disconnects when nothing remains', async () => {
    watchOnly.watchOnlyAddresses = { EVM: [], BITCOIN: [] }
    await useAccountSwitch().deleteAccount(acc({ id: 'EVM:0xactive', address: '0xactive' }))
    expect(walletStore.disconnectWallet).toHaveBeenCalledTimes(1)
  })
})
