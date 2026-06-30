// tests/unit/stores/savedAccounts/savedAccountsLogic.spec.ts
import { describe, it, expect, vi } from 'vitest'

// walletConfigs.ts pulls in @enkryptcom/hw-wallets which has a broken CJS/ESM
// split in the test environment. We only need the WalletConfigType enum here,
// so mock the whole module and re-export what the test uses.
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {
    MOBILE: 'mobile',
    HARDWARE: 'hardware',
    SOFTWARE: 'software',
    DESKTOP: 'desktop',
    EXTENSION: 'extension',
    MOCK: 'mock',
  },
}))

import {
  buildId,
  upsert,
  isAtCap,
  canAdd,
  removeById,
  promoteNext,
  backfillMerge,
  SAVED_ACCOUNTS_CAP,
  type SavedAccount,
} from '@/stores/saved_accounts/savedAccountsLogic'
import { WalletConfigType } from '@/modules/access/common/walletConfigs'
import { WalletType } from '@/providers/types/index'

const acct = (over: Partial<SavedAccount> = {}): SavedAccount => ({
  id: over.id ?? buildId('EVM', over.address ?? '0xAbC0000000000000000000000000000000000001'),
  address: over.address ?? '0xAbC0000000000000000000000000000000000001',
  chainType: 'EVM',
  kind: 'watchOnly',
  walletConfigType: WalletConfigType.EXTENSION,
  providerType: WalletType.WAGMI,
  connectorId: 'enkrypt',
  walletName: 'Enkrypt',
  icon: 'enkrypt.webp',
  addedAt: 1,
  ...over,
})

describe('savedAccountsLogic', () => {
  it('buildId lowercases the address and prefixes the chain type', () => {
    expect(buildId('EVM', '0xAbC')).toBe('EVM:0xabc')
    expect(buildId('BITCOIN', 'bc1QXyz')).toBe('BITCOIN:bc1qxyz')
  })

  it('upsert adds a new account and replaces an existing id while preserving addedAt', () => {
    const a = acct({ address: '0x1', addedAt: 10 })
    const list = upsert([], a)
    expect(list).toHaveLength(1)
    const replaced = upsert(list, acct({ address: '0x1', walletName: 'Renamed', addedAt: 99 }))
    expect(replaced).toHaveLength(1)
    expect(replaced[0].walletName).toBe('Renamed')
    expect(replaced[0].addedAt).toBe(10) // original addedAt preserved
  })

  it('isAtCap / canAdd respect the cap but always allow replacing an existing id', () => {
    const list = Array.from({ length: SAVED_ACCOUNTS_CAP }, (_, i) =>
      acct({ address: '0x' + i, addedAt: i }),
    )
    expect(isAtCap(list)).toBe(true)
    expect(canAdd(list, acct({ address: '0xnew' }))).toBe(false)        // new id blocked at cap
    expect(canAdd(list, acct({ address: '0x1', walletName: 'x' }))).toBe(true) // existing id allowed
    expect(canAdd(list.slice(0, 5), acct({ address: '0xnew' }))).toBe(true)
  })

  it('removeById removes only the matching id', () => {
    const list = [acct({ address: '0x1' }), acct({ address: '0x2' })]
    const after = removeById(list, buildId('EVM', '0x2'))
    expect(after.map(a => a.address)).toEqual(['0x1'])
  })

  it('promoteNext returns the earliest-added remaining account, or null when empty', () => {
    const list = [acct({ address: '0xb', addedAt: 20 }), acct({ address: '0xa', addedAt: 5 })]
    expect(promoteNext(list)?.address).toBe('0xa')
    expect(promoteNext([])).toBeNull()
  })

  it('backfillMerge unions by id and never overwrites an existing record', () => {
    const existing = [acct({ address: '0x1', walletName: 'Keep', addedAt: 1 })]
    const seeds = [
      acct({ address: '0x1', walletName: 'IGNORED', addedAt: 999 }),
      acct({ address: '0x2', walletName: 'New', addedAt: 2 }),
    ]
    const merged = backfillMerge(existing, seeds)
    expect(merged).toHaveLength(2)
    expect(merged.find(a => a.address === '0x1')!.walletName).toBe('Keep')
    expect(merged.find(a => a.address === '0x2')!.walletName).toBe('New')
  })
})
