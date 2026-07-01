// src/stores/saved_accounts/savedAccountsLogic.ts
import type { WalletConfigType } from '@/modules/access/common/walletConfigs'
import type { Chain, ChainType } from '@/mew_api/types'
import type { WalletType } from '@/providers/types/index'

export type SavedAccountKind = 'signing' | 'watchOnly'

/** Shape persisted in watchOnlyStore ('watchOnlyList'). */
export interface PersistedEntry {
  address: string
  walletName: string
  chain: Chain
  type: ChainType
  walletType: string
  addressName: string
}

export interface RecentAddress {
  [chainType: string]: PersistedEntry[]
}

/** In-memory view-model consumed by the popup / row / switch / balances. */
export interface SavedAccount {
  id: string
  address: string
  chainType: ChainType
  kind: SavedAccountKind
  walletConfigType: WalletConfigType
  providerType: WalletType
  connectorId?: string
  walletName: string
  addressName: string
  icon: string
  derivationPath?: string
}

export const SAVED_ACCOUNTS_CAP = 20

/** Wallet types MEW can re-derive/reconnect → treated as signing accounts. */
const SIGNING_WALLET_TYPES = new Set([
  'PRIVATE_KEY',
  'MNEMONIC',
  'WAGMI',
  'INJECTED',
  'TREZOR',
  'LEDGER',
])

export function buildId(chainType: ChainType, address: string): string {
  return `${chainType}:${address.toLowerCase()}`
}

export function flatten(list: RecentAddress): PersistedEntry[] {
  return Object.values(list).flat()
}

export function countAll(list: RecentAddress): number {
  return flatten(list).length
}

export function isAtCap(
  list: RecentAddress,
  cap: number = SAVED_ACCOUNTS_CAP,
): boolean {
  return countAll(list) >= cap
}

export function canAdd(
  list: RecentAddress,
  chainType: ChainType,
  address: string,
  cap: number = SAVED_ACCOUNTS_CAP,
): boolean {
  const exists = (list[chainType] ?? []).some(
    e => e.address.toLowerCase() === address.toLowerCase(),
  )
  if (exists) return true
  return !isAtCap(list, cap)
}

export function upsertEntry(
  list: RecentAddress,
  entry: PersistedEntry,
): RecentAddress {
  const bucket = [...(list[entry.type] ?? [])]
  const idx = bucket.findIndex(
    e => e.address.toLowerCase() === entry.address.toLowerCase(),
  )
  if (idx === -1) bucket.push(entry)
  else bucket[idx] = entry
  return { ...list, [entry.type]: bucket }
}

export function removeEntry(
  list: RecentAddress,
  chainType: ChainType,
  address: string,
): RecentAddress {
  const bucket = (list[chainType] ?? []).filter(
    e => e.address.toLowerCase() !== address.toLowerCase(),
  )
  return { ...list, [chainType]: bucket }
}

/** After a removal, choose the entry to activate: last in the removed bucket, else first remaining anywhere, else null. */
export function promoteNext(
  list: RecentAddress,
  removedType: ChainType,
  _removedAddress: string,
): PersistedEntry | null {
  const sameBucket = list[removedType] ?? []
  if (sameBucket.length) return sameBucket[sameBucket.length - 1]
  const rest = flatten(list)
  return rest.length ? rest[0] : null
}

const DEFAULT_NAME_RE = /^Address (\d+)$/

export function nextDefaultName(list: RecentAddress): string {
  const taken = new Set<number>()
  for (const e of flatten(list)) {
    const m = DEFAULT_NAME_RE.exec(e.addressName ?? '')
    if (m) taken.add(Number(m[1]))
  }
  let n = 1
  while (taken.has(n)) n += 1
  return `Address ${n}`
}

export function isNameUnique(
  list: RecentAddress,
  name: string,
  exceptKey?: string,
): boolean {
  return !flatten(list).some(
    e => e.addressName === name && buildId(e.type, e.address) !== exceptKey,
  )
}

/** Assign a unique default name to every entry missing one. Idempotent. */
export function backfillNames(list: RecentAddress): RecentAddress {
  let working: RecentAddress = { ...list }
  for (const type of Object.keys(list)) {
    const bucket = [...(list[type] ?? [])]
    bucket.forEach((e, i) => {
      if (!e.addressName) {
        bucket[i] = { ...e, addressName: nextDefaultName(working) }
        working = { ...working, [type]: [...bucket] }
      }
    })
    working = { ...working, [type]: bucket }
  }
  return working
}

export function deriveKind(walletType: string): SavedAccountKind {
  return SIGNING_WALLET_TYPES.has(walletType) ? 'signing' : 'watchOnly'
}

export interface ToSavedAccountCtx {
  config?: {
    id?: string
    icon?: unknown
    type?: WalletConfigType[]
  }
  kindOverride?: SavedAccountKind
  fallbackConfigType: WalletConfigType
}

export function toSavedAccount(
  entry: PersistedEntry,
  ctx: ToSavedAccountCtx,
): SavedAccount {
  return {
    id: buildId(entry.type, entry.address),
    address: entry.address,
    chainType: entry.type,
    kind: ctx.kindOverride ?? deriveKind(entry.walletType),
    walletConfigType: ctx.config?.type?.[0] ?? ctx.fallbackConfigType,
    providerType: entry.walletType as WalletType,
    connectorId: ctx.config?.id,
    walletName: entry.walletName || entry.address,
    addressName: entry.addressName,
    icon: typeof ctx.config?.icon === 'string' ? ctx.config.icon : '',
  }
}
