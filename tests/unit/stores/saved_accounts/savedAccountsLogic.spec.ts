import { describe, it, expect, vi } from 'vitest'

vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {
    MOBILE: 'mobile', HARDWARE: 'hardware', SOFTWARE: 'software',
    DESKTOP: 'desktop', EXTENSION: 'extension', MOCK: 'mock',
  },
  walletConfigs: {},
}))

import {
  SAVED_ACCOUNTS_CAP,
  buildId,
  flatten,
  countAll,
  isAtCap,
  canAdd,
  upsertEntry,
  removeEntry,
  promoteNext,
  nextDefaultName,
  isNameUnique,
  backfillNames,
  deriveKind,
  type RecentAddress,
  type PersistedEntry,
} from '@/stores/saved_accounts/savedAccountsLogic'

const chain = (type = 'EVM') => ({ type, name: type === 'EVM' ? 'ETH' : 'BTC' }) as any
const entry = (over: Partial<PersistedEntry> = {}): PersistedEntry => ({
  address: over.address ?? '0xAbC0000000000000000000000000000000000001',
  walletName: over.walletName ?? 'Enkrypt',
  chain: over.chain ?? chain(over.type ?? 'EVM'),
  type: (over.type ?? 'EVM') as any,
  walletType: over.walletType ?? 'INJECTED',
  addressName: over.addressName ?? 'Address 1',
})
const list = (evm: PersistedEntry[] = [], btc: PersistedEntry[] = []): RecentAddress => ({
  EVM: evm, BITCOIN: btc,
})

describe('savedAccountsLogic', () => {
  it('cap is 20', () => {
    expect(SAVED_ACCOUNTS_CAP).toBe(20)
  })

  it('buildId lowercases + prefixes chain type', () => {
    expect(buildId('EVM' as any, '0xAbC')).toBe('EVM:0xabc')
  })

  it('flatten + countAll span all buckets', () => {
    const l = list([entry({ address: '0x1' })], [entry({ address: 'bc1', type: 'BITCOIN' })])
    expect(flatten(l)).toHaveLength(2)
    expect(countAll(l)).toBe(2)
  })

  it('isAtCap / canAdd respect a 20 total cap but always allow replacing an existing address', () => {
    const evm = Array.from({ length: 20 }, (_, i) =>
      entry({ address: '0x' + i, addressName: 'Address ' + i }),
    )
    const l = list(evm)
    expect(isAtCap(l)).toBe(true)
    expect(canAdd(l, 'EVM' as any, '0xnew')).toBe(false)
    expect(canAdd(l, 'EVM' as any, '0x1')).toBe(true)
    expect(canAdd(list(evm.slice(0, 5)), 'EVM' as any, '0xnew')).toBe(true)
  })

  it('upsertEntry adds new, replaces by dedupe key, keeps bucket order', () => {
    let l = list()
    l = upsertEntry(l, entry({ address: '0x1', addressName: 'A' }))
    l = upsertEntry(l, entry({ address: '0x2', addressName: 'B' }))
    expect(l.EVM.map(e => e.address)).toEqual(['0x1', '0x2'])
    l = upsertEntry(l, entry({ address: '0x1', walletName: 'Renamed', addressName: 'A' }))
    expect(l.EVM).toHaveLength(2)
    expect(l.EVM.find(e => e.address === '0x1')!.walletName).toBe('Renamed')
  })

  it('removeEntry removes only the matching address in its bucket', () => {
    const l = list([entry({ address: '0x1' }), entry({ address: '0x2' })])
    expect(removeEntry(l, 'EVM' as any, '0x2').EVM.map(e => e.address)).toEqual(['0x1'])
  })

  it('promoteNext returns the last remaining entry in the removed bucket, else any remaining, else null', () => {
    const l = list([entry({ address: '0xa' }), entry({ address: '0xb' })])
    expect(promoteNext(removeEntry(l, 'EVM' as any, '0xb'), 'EVM' as any, '0xb')?.address).toBe('0xa')
    expect(promoteNext(list(), 'EVM' as any, '0xa')).toBeNull()
    const cross = list([], [entry({ address: 'bc1', type: 'BITCOIN' })])
    expect(promoteNext(cross, 'EVM' as any, '0xgone')?.address).toBe('bc1')
  })

  it('nextDefaultName finds the lowest free "Address N" globally', () => {
    expect(nextDefaultName(list())).toBe('Address 1')
    const l = list(
      [entry({ address: '0x1', addressName: 'Address 1' })],
      [entry({ address: 'bc1', type: 'BITCOIN', addressName: 'Address 2' })],
    )
    expect(nextDefaultName(l)).toBe('Address 3')
    const gap = list([
      entry({ address: '0x1', addressName: 'Address 1' }),
      entry({ address: '0x3', addressName: 'Address 3' }),
    ])
    expect(nextDefaultName(gap)).toBe('Address 2')
  })

  it('isNameUnique is global and honours exceptKey for self-rename', () => {
    const l = list(
      [entry({ address: '0x1', addressName: 'Savings' })],
      [entry({ address: 'bc1', type: 'BITCOIN', addressName: 'Trading' })],
    )
    expect(isNameUnique(l, 'Fresh')).toBe(true)
    expect(isNameUnique(l, 'Savings')).toBe(false)
    expect(isNameUnique(l, 'Trading')).toBe(false)
    expect(isNameUnique(l, 'Savings', buildId('EVM' as any, '0x1'))).toBe(true)
  })

  it('backfillNames assigns unique default names only to entries missing one, idempotently', () => {
    const l = list([
      entry({ address: '0x1', addressName: '' }),
      entry({ address: '0x2', addressName: 'Keep' }),
      entry({ address: '0x3', addressName: '' }),
    ])
    const filled = backfillNames(l)
    const names = filled.EVM.map(e => e.addressName)
    expect(names).toContain('Keep')
    expect(names.filter(n => !n).length).toBe(0)
    expect(new Set(names).size).toBe(names.length)
    expect(backfillNames(filled)).toEqual(filled)
  })

  it('deriveKind maps re-connectable wallet types to signing, unknown to watchOnly', () => {
    expect(deriveKind('LEDGER')).toBe('signing')
    expect(deriveKind('INJECTED')).toBe('signing')
    expect(deriveKind('MNEMONIC')).toBe('signing')
    expect(deriveKind('WATCH_ONLY_ADDRESS')).toBe('watchOnly')
    expect(deriveKind('')).toBe('watchOnly')
  })
})
