import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: { SOFTWARE: 'software', EXTENSION: 'extension' },
  walletConfigs: {},
}))
const walletState = { walletAddress: null as string | null, walletName: '', isWatchOnly: false, wallet: null as any }
vi.mock('@/stores/walletStore', () => ({ useWalletStore: () => walletState }))
const chainState = { selectedChain: { type: 'EVM', name: 'ETH' } as any }
vi.mock('@/stores/chainsStore', () => ({ useChainsStore: () => chainState }))

import { useWatchOnlyStore } from '@/stores/watchOnlyStore'

const evmChain = { type: 'EVM', name: 'ETH' } as any

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
  walletState.walletAddress = null
  walletState.isWatchOnly = false
})

describe('watchOnlyStore (extended)', () => {
  it('addWallet auto-assigns a unique default addressName and dedupes by address', () => {
    const s = useWatchOnlyStore()
    s.addWallet('0x1', evmChain, 'INJECTED', 'EVM', 'Enkrypt')
    s.addWallet('0x2', evmChain, 'LEDGER', 'EVM', 'Ledger')
    expect(s.watchOnlyAddresses.EVM.map(e => e.addressName)).toEqual(['Address 1', 'Address 2'])
    s.addWallet('0x1', evmChain, 'INJECTED', 'EVM', 'Enkrypt')
    expect(s.watchOnlyAddresses.EVM).toHaveLength(2)
  })

  it('addWallet enforces the 20-total cap (extra adds are dropped)', () => {
    const s = useWatchOnlyStore()
    for (let i = 0; i < 22; i++) s.addWallet('0x' + i, evmChain, 'INJECTED', 'EVM', 'W')
    expect(s.watchOnlyAddresses.EVM).toHaveLength(20)
  })

  it('tryAddAddress reports duplicate reasons', () => {
    const s = useWatchOnlyStore()
    expect(s.tryAddAddress('0x1', evmChain, 'INJECTED', 'EVM', 'W')).toEqual({ added: true })
    expect(s.tryAddAddress('0x1', evmChain, 'INJECTED', 'EVM', 'W')).toEqual({ added: false, reason: 'duplicate' })
  })

  it('activeId/activeAccount derive from walletStore + selectedChain', () => {
    const s = useWatchOnlyStore()
    s.addWallet('0xAbC', evmChain, 'INJECTED', 'EVM', 'Enkrypt')
    walletState.walletAddress = '0xabc'
    expect(s.activeId).toBe('EVM:0xabc')
    expect(s.activeAccount?.address).toBe('0xAbC')
    expect(s.savedAccounts).toHaveLength(0)
  })

  it('renameAccount rejects a duplicate name and applies a unique one', () => {
    const s = useWatchOnlyStore()
    s.addWallet('0x1', evmChain, 'INJECTED', 'EVM', 'W')
    s.addWallet('0x2', evmChain, 'INJECTED', 'EVM', 'W')
    expect(s.renameAccount('EVM:0x2', 'Address 1')).toEqual({ ok: false, reason: 'duplicate' })
    expect(s.renameAccount('EVM:0x2', 'Savings')).toEqual({ ok: true })
    expect(s.watchOnlyAddresses.EVM.find(e => e.address === '0x2')!.addressName).toBe('Savings')
  })

  it('addWallet moves a re-touched existing entry to the bucket tail', () => {
    const s = useWatchOnlyStore()
    s.addWallet('0x1', evmChain, 'INJECTED', 'EVM', 'Enkrypt')
    s.addWallet('0x2', evmChain, 'LEDGER', 'EVM', 'Ledger')
    // Re-add 0x1 — must move to tail, preserve addressName, length stays 2
    s.addWallet('0x1', evmChain, 'INJECTED', 'EVM', 'Enkrypt')
    const bucket = s.watchOnlyAddresses.EVM
    expect(bucket).toHaveLength(2)
    expect(bucket.map(e => e.address)).toEqual(['0x2', '0x1'])
    expect(bucket[1].addressName).toBe('Address 1')
  })

  it('backfill assigns names to legacy entries missing addressName', () => {
    localStorage.setItem('watchOnlyList', JSON.stringify({
      EVM: [{ address: '0x1', walletName: 'W', chain: evmChain, type: 'EVM', walletType: 'INJECTED' }],
      BITCOIN: [],
    }))
    const s = useWatchOnlyStore()
    s.backfill()
    expect(s.watchOnlyAddresses.EVM[0].addressName).toBe('Address 1')
  })
})
