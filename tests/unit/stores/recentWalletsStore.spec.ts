import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

// The wallet configs reach the hardware-wallet SDK — unavailable under jsdom.
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))

import { useRecentWalletsStore } from '@/stores/recentWalletsStore'

const wallet = (id: string, extra = {}) =>
  ({ id, name: id, icon: '', type: [], ...extra }) as never
const names = () => useRecentWalletsStore().recentWallets.map(w => w.name)

describe('recentWalletsStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('keeps the wallets in the order they were used, the latest last', () => {
    const store = useRecentWalletsStore()

    store.addWallet(wallet('MetaMask'))
    store.addWallet(wallet('Ledger'))

    expect(names()).toEqual(['MetaMask', 'Ledger'])
  })

  it('makes a wallet that is used again the most recent one', () => {
    const store = useRecentWalletsStore()
    store.addWallet(wallet('MetaMask'))
    store.addWallet(wallet('Ledger'))

    store.addWallet(wallet('MetaMask'))

    expect(names()).toEqual(['Ledger', 'MetaMask'])
  })

  it('remembers two wallets, dropping the one used longest ago', () => {
    const store = useRecentWalletsStore()
    store.addWallet(wallet('MetaMask'))
    store.addWallet(wallet('Ledger'))

    store.addWallet(wallet('Rabby'))

    expect(names()).toEqual(['Ledger', 'Rabby'])
  })

  it('does not list MEW’s own wallets, which have their own place', () => {
    const store = useRecentWalletsStore()

    store.addWallet(wallet('Enkrypt', { isOfficial: true }))

    expect(names()).toEqual([])
  })
})
